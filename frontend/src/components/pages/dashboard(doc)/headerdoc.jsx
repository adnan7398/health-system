import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaRegListAlt,
  FaUsersCog,
  FaSignOutAlt,
  FaStethoscope,
  FaChevronDown,
  FaMicrophoneAlt,
  FaBloggerB,
} from "react-icons/fa";
import "../../pages/home.css";

const DoctorHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleNavigation = (event) => {
    const selectedValue = event.target.value;
    setSelectedDisease(selectedValue);

    if (selectedValue === "breastcancer") {
      // Add navigation or functionality for breast cancer here
    } else if (selectedValue === "pcod") {
      navigate("/pcod");
    } else if (selectedValue === "heart-disease") {
      navigate("/heartdisease");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo1.png" alt="Logo" />
        <h1>Arogyam</h1>
      </div>

      <ul>
        <li>
          <a href="/DoctorDashboard">
            <FaHome /> Dashboard
          </a>
        </li>
        <li>
          <a href="/appointment">
            <FaRegListAlt /> Appointments
          </a>
        </li>
        <li>
          <a href="/patient">
            <FaUsersCog /> My Patients
          </a>
        </li>
        <li>
          <a href="/conference">
            <FaMicrophoneAlt /> Conferences
          </a>
        </li>

        {/* Disease Selector */}
        <div className="disease-selector">
          <FaStethoscope className="disease-icon" />
          <label htmlFor="disease">Select Disease:</label>
          <div className="dropdown-container">
            <select
              id="disease"
              value={selectedDisease}
              onChange={handleNavigation}
              className="disease-dropdown"
            >
              <option value="">-- Select --</option>

              <option value="pcod">PCOD</option>
              <option value="heart-disease">Heart Disease</option>
            </select>
            <FaChevronDown className="dropdown-arrow" />
          </div>
        </div>

        <li>
          <a href="/blogging">
            <FaBloggerB /> Blogs
          </a>
        </li>
      </ul>

      {/* Authentication Buttons */}
      <div className="auth-buttons">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="auth-button logout-button">
            <FaSignOutAlt /> Logout
          </button>
        ) : (
          <a href="/doctor/signin" className="auth-button sign-in-button">
            Doctor Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default DoctorHeader;
