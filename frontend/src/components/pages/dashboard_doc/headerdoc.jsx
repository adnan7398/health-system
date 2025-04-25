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
  FaHospital
} from "react-icons/fa";
import "../../pages/home.css";

const DoctorHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleDiseaseChange = (disease) => {
    setSelectedDisease(disease);
    setIsDropdownOpen(false);
    navigate(`/${disease}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo1.png" alt="Arogyam Logo" />
        <h1>Arogyam</h1>
      </div>

      {/* Mobile menu toggle */}
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={isMenuOpen ? "open" : ""}>
        <li>
          <a onClick={() => handleNavigation("/doctordashboard")}>
            <FaHome /> Dashboard
          </a>
        </li>
        <li>
          <a onClick={() => handleNavigation("/appointment")}>
            <FaRegListAlt /> Appointments
          </a>
        </li>
        <li>
          <a onClick={() => handleNavigation("/patient")}>
            <FaUsersCog /> My Patients
          </a>
        </li>
        <li>
          <a onClick={() => handleNavigation("/conference")}>
            <FaMicrophoneAlt /> Conferences
          </a>
        </li>

        {/* Disease Selector - Dropdown */}
        <li className="dropdown-nav-item">
          <a onClick={toggleDropdown} className="dropdown-toggle">
            <FaStethoscope /> Disease Prediction <FaChevronDown />
          </a>
          <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            <a onClick={() => handleDiseaseChange("pcod")}>PCOD</a>
            <a onClick={() => handleDiseaseChange("heartdisease")}>Heart Disease</a>
            <a onClick={() => handleDiseaseChange("pneumonia")}>Pneumonia</a>
            <a onClick={() => handleDiseaseChange("breastcancer")}>Breast Cancer</a>
          </div>
        </li>

        <li>
          <a onClick={() => handleNavigation("/blogging")}>
            <FaBloggerB /> Health Blog
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
          <a 
            onClick={() => handleNavigation("/doctor/signin")} 
            className="auth-button sign-in-button">
            Doctor Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default DoctorHeader;
