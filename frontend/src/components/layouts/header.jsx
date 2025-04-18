import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaHome,
  FaQrcode,
  FaRobot,
  FaRunning,
  FaWeight,
  FaUserMd,
  FaHospital,
} from "react-icons/fa";

import "../../components/pages/home.css";
import LanguageSelector from "../language/LanguageSelector";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              setIsMenuOpen(false);
            }}
          >
            <FaHome /> Home
          </a>
        </li>

        <li>
          <a
            href="/scanner"
            onClick={(e) => {
              e.preventDefault();
              isAuthenticated ? navigate("/scanner") : navigate("/signin");
              setIsMenuOpen(false);
            }}
          >
            <FaQrcode /> Health Card
          </a>
        </li>

        <li>
          <a 
            href="/calorieconvertor"
            onClick={(e) => {
              e.preventDefault();
              navigate("/calorieconvertor");
              setIsMenuOpen(false);
            }}
          >
            <FaWeight /> Health Metrics
          </a>
        </li>
        
        <li>
          <a 
            href="/fitness"
            onClick={(e) => {
              e.preventDefault();
              navigate("/fitness");
              setIsMenuOpen(false);
            }}
          >
            <FaRunning /> Fitness Plans
          </a>
        </li>

        {/* Conditional Navigation */}
        {userRole === "doctor" ? (
          <li>
            <a 
              href="/doctordashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/doctordashboard");
                setIsMenuOpen(false);
              }}
            >
              <FaUserMd /> Doctor Portal
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
                  setIsMenuOpen(false);
                }}
              >
                <FaRobot /> Health Assistant
              </a>
            </li>

            <li>
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  isAuthenticated ? navigate("/register") : navigate("/signup");
                  setIsMenuOpen(false);
                }}
              >
                <FaHospital /> Medical Records
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
              onClick={(e) => {
                e.preventDefault();
                navigate("/signin");
                setIsMenuOpen(false);
              }}
            >
              Patient Login
            </a>
            <a 
              href="/doctor/signin" 
              className="auth-button sign-in-button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/doctor/signin");
                setIsMenuOpen(false);
              }}
            >
              Doctor Login
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
