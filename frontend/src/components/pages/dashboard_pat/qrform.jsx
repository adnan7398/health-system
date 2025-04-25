import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (selectedImage) {
        data.append("profileImage", selectedImage);
      }

      const response = await axios.post(
        "http://localhost:3000/register",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("QR Code Data:", response.data.qrCode); // Debugging
      setMessage(response.data.message);
      setQrCode(response.data.qrCode);
      localStorage.setItem("userId", response.data.userId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="info-section">
        <h2>Why Generate a QR Code?</h2>
        <p>
          Generating a unique QR code allows you to store your medical
          information securely and access it anytime.
        </p>
      </div>

      <div className="form-section">
        <h2>Fill the Details and Generate Your QR Code</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Generate QR Code</button>
        </form>
        {qrCode && (
          <div className="qr-code">
            <h3>Your QR Code:</h3>
            <img src={qrCode} alt="Generated QR Code" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
