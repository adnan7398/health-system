import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaHome,
  FaQrcode,
  FaRobot,
  FaRunning,
  FaWeight,
} from "react-icons/fa";

import "../../components/pages/home.css";
import LanguageSelector from "../language/LanguageSelector";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      setIsAuthenticated(!!token);
      setUserRole(role);
    };

    checkAuth();

    // Listen for changes in localStorage
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctortoken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);

    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo1.png" alt="Logo" />
        <h1>Arogyam</h1>
      </div>

      <ul>
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              isAuthenticated ? navigate("/scanner") : navigate("/signin");
            }}
          >
            <FaHome /> QR Scanner
          </a>
        </li>

        <li>
          <a href="/calorieconvertor">
            <FaWeight /> Calorie Calculator
          </a>
        </li>
        <li>
          <a href="/fitness">
            <FaRunning /> Get Fit
          </a>
        </li>

        {/* Conditional Navigation */}
        {userRole === "doctor" ? (
          <li>
            <a href="/doctor/dashboard">
              <FaRobot /> Doctor Dashboard
            </a>
          </li>
        ) : (
          <>
            <li>
              <a
                href="/chatbot"
                onClick={(e) => {
                  e.preventDefault();
                  isAuthenticated ? navigate("/chatbot") : navigate("/signin");
                }}
              >
                <FaRobot /> Assistant
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  isAuthenticated ? navigate("/register") : navigate("/signup");
                }}
              >
                <FaQrcode /> QR Generator
              </a>
            </li>
          </>
        )}
      </ul>

      {/* Authentication Buttons */}
      <div className="auth-buttons">
        <LanguageSelector />
        
        {isAuthenticated ? (
          <button onClick={handleLogout} className="auth-button logout-button">
            Logout
          </button>
        ) : (
          <>
            <a
              href="/signin"
              className={`auth-button sign-in-button ${
                userRole === "doctor" ? "hidden" : ""
              }`}
            >
              Patient Login
            </a>
            <a href="/doctor/signin" className="auth-button sign-in-button">
              Doctor Login
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
