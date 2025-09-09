import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Droplets,
  QrCode,
  Camera,
  Download,
  CheckCircle,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import QRScanner from "../dashboard_pat/qrscanner";
import "../css files patient/qrform.css";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");
    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bloodGroup: "",
    age: "",
    phoneNumber: "",
    address: "",
  });

  const [qrCode, setQrCode] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleScanSuccess = (decodedText) => {
    try {
      const parsedData = JSON.parse(decodedText);
      setScannedData(parsedData);

      setFormData({
        firstName: parsedData.firstName || "",
        lastName: parsedData.lastName || "",
        bloodGroup: parsedData.bloodGroup || "",
        age: parsedData.age || "",
        phoneNumber: parsedData.phoneNumber || "",
        address: parsedData.address || "",
      });

      setMessage("QR code scanned successfully! Form auto-filled with scanned data.");
      setMessageType("success");
      setShowScanner(false);
    } catch (error) {
      setMessage("Invalid QR code format. Please scan a valid medical QR code.");
      setMessageType("error");
      setShowScanner(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (selectedImage) {
        data.append("profileImage", selectedImage);
      }

      const response = await axios.post("https://arogyam-15io.onrender.com/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message || "QR Code generated successfully!");
      setMessageType("success");
      setQrCode(response.data.qrCode);
      localStorage.setItem("userId", response.data.userId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = `medical-qr-${formData.firstName}-${formData.lastName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medical QR Code Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create your secure medical information QR code for quick access during emergencies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Why Generate a QR Code?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Access</h3>
                    <p className="text-gray-600 text-sm">
                      Instant access to your medical information during emergencies
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Critical Info</h3>
                    <p className="text-gray-600 text-sm">
                      Blood group, allergies, and emergency contacts readily available
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Storage</h3>
                    <p className="text-gray-600 text-sm">
                      Encrypted and secure storage of your medical data
                    </p>
                  </div>
                </div>
              </div>

              {/* Scanner Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Scan Existing QR Code
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Scan an existing medical QR code to auto-fill the form
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Medical Information Form
              </h2>

              {/* Message Display */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  messageType === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center">
                    {messageType === 'success' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    <span>{message}</span>
                  </div>
                </div>
              )}

              {/* Scanned Data Indicator */}
              {scannedData && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <QrCode className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-700 font-medium">
                      Form auto-filled from scanned QR code
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Blood Group and Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Droplets className="w-4 h-4 inline mr-1" />
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating QR Code...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </button>
              </form>

              {/* QR Code Display */}
              {qrCode && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      Your Medical QR Code
                    </h3>
                    
                    <div className="bg-white p-6 rounded-lg inline-block shadow-sm border border-gray-200 mb-4">
                      <img 
                        src={qrCode} 
                        alt="Generated Medical QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                      >
                        {showQRCode ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide QR Code
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Show QR Code
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={downloadQRCode}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-4">
                      Save this QR code and keep it accessible for medical emergencies
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">QR Scanner</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
