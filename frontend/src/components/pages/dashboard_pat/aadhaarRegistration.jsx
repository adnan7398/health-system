import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaIdCard, FaUser, FaPhone, FaMapMarkerAlt, FaTint, FaCalendarAlt, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const AadhaarRegistration = () => {
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    firstName: "",
    lastName: "",
    age: "",
    phoneNumber: "",
    address: "",
    bloodGroup: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (check both localStorage and sessionStorage)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Check if user already has a health card
    checkHealthCardStatus();
  }, [navigate]);

  const checkHealthCardStatus = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      
      const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
      const response = await fetch(`${API_BASE}/health-card-status`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isHealthCardRegistered) {
          // User already has health card, redirect to dashboard
          navigate("/userdashboard");
        }
      }
    } catch (error) {
      console.error("Error checking health card status:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate Aadhaar number (only allow digits, max 12)
    if (name === "aadhaarNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 12) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    // Validate age (only allow digits, max 3)
    if (name === "age") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 3) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    // Validate phone number (only allow digits, max 10)
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation
    if (formData.aadhaarNumber.length !== 12) {
      setMessage("Aadhaar number must be exactly 12 digits");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.age || !formData.phoneNumber || !formData.address || !formData.bloodGroup) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setMessage("You are not logged in. Please login first.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Try register-aadhaar first, fallback to register if it doesn't exist
      let response;
      let useRegisterEndpoint = false;
      
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
        response = await fetch(`${API_BASE}/register-aadhaar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

        // If 404, we'll use /register endpoint instead
        if (response.status === 404) {
          useRegisterEndpoint = true;
        }
      } catch (fetchError) {
        // If fetch fails entirely, use /register as fallback
        useRegisterEndpoint = true;
        response = null;
      }
      
      // If we got 404 or fetch failed, use /register endpoint
      if (useRegisterEndpoint || !response) {
        const registerData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bloodGroup: formData.bloodGroup,
          age: formData.age,
          phoneNumber: formData.phoneNumber,
          address: formData.address
        };
        
        const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
        response = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(registerData)
        });
      }

      // Check response status before reading body
      const isOk = response.ok;
      const status = response.status;
      const statusText = response.statusText;

      let data;
      try {
        // Try to parse as JSON
        const responseText = await response.text();
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            // If response is not JSON
            console.error("Non-JSON response:", responseText);
            setMessage(`Server error: ${status} ${statusText}. ${responseText.substring(0, 100)}`);
            setMessageType("error");
            setLoading(false);
            return;
          }
        } else {
          data = {};
        }
      } catch (error) {
        console.error("Error reading response:", error);
        setMessage(`Error reading server response: ${error.message}`);
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (isOk) {
        setMessage("Health card registered successfully! Redirecting to scanner...");
        setMessageType("success");
        
        // Store userId if provided in response
        if (data.user && data.user.id) {
          localStorage.setItem("userId", data.user.id);
          sessionStorage.setItem("userId", data.user.id);
        }
        
        // Redirect to scanner after 2 seconds (scanner is the entry gate)
        setTimeout(() => {
          navigate("/scanner");
        }, 2000);
      } else {
        setMessage(data.message || `Registration failed: ${status} ${statusText}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setMessage("Network error. Please check your internet connection and try again.");
      } else {
        setMessage(`Error: ${error.message}. Please try again.`);
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaIdCard className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Card Registration</h1>
          <p className="text-gray-600">Complete your health profile with Aadhaar verification</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            messageType === "success" 
              ? "bg-green-100 border border-green-300 text-green-700" 
              : "bg-red-100 border border-red-300 text-red-700"
          }`}>
            {messageType === "success" ? (
              <FaCheckCircle className="text-green-600 text-xl" />
            ) : (
              <FaExclamationTriangle className="text-red-600 text-xl" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Aadhaar Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaIdCard className="inline mr-2 text-teal-600" />
                Aadhaar Number *
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                maxLength={12}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: XXXX-XXXX-XXXX (12 digits)
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-teal-600" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-teal-600" />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Age and Blood Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-teal-600" />
                  Age *
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaTint className="inline mr-2 text-teal-600" />
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPhone className="inline mr-2 text-teal-600" />
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                maxLength={10}
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-teal-600" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt className="text-xl" />
                  <span>Register Health Card</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <FaShieldAlt className="mr-2" />
            Why Aadhaar Verification?
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Ensures unique identification and prevents duplicate registrations</li>
            <li>• Links your health records with government databases</li>
            <li>• Enables seamless access to healthcare services</li>
            <li>• Provides secure and verified health information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AadhaarRegistration;
