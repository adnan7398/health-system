import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import "../css files patient/verifyauth.css";

const EnterPassword = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`https://arogyam-15io.onrender.com/details/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("User not found.");
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://arogyam-15io.onrender.com/auth", {
        userId,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/userdashboard");
    } catch (err) {
      setError("Incorrect password, try again.");
    }
  };

  return (
    <div className="enter-password-container">
      <h2>Verify Your Identity</h2>

      {user ? (
        <div className="user-details">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Blood group:</strong> {user.bloodGroup}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}

      {/* Password Input Field with Eye Icon */}
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          className="password-input"
          placeholder="Enter your Security Key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </span>
      </div>

      {/* Submit Button */}
      <button className="submit-btn" onClick={handleLogin}>
        Submit
      </button>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default EnterPassword;
