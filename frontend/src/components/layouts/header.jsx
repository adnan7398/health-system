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
  FaHeartbeat,
} from "react-icons/fa";

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
    <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-md">
              <FaHeartbeat className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Arogyam</h1>
              <p className="text-sm text-slate-500 -mt-1">Healthcare Technology</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
            >
              <FaHome className="text-slate-500 group-hover:text-slate-700" />
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="/scanner"
              onClick={(e) => {
                e.preventDefault();
                isAuthenticated ? navigate("/scanner") : navigate("/signin");
              }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
            >
              <FaQrcode className="text-slate-500 group-hover:text-slate-700" />
              <span>Health Card</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a 
              href="/calorieconvertor"
              onClick={(e) => {
                e.preventDefault();
                navigate("/calorieconvertor");
              }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
            >
              <FaWeight className="text-slate-500 group-hover:text-slate-700" />
              <span>Health Metrics</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/fitness"
              onClick={(e) => {
                e.preventDefault();
                navigate("/fitness");
              }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
            >
              <FaRunning className="text-slate-500 group-hover:text-slate-700" />
              <span>Fitness Plans</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* Conditional Navigation */}
            {userRole === "doctor" ? (
              <a 
                href="/doctordashboard"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/doctordashboard");
                }}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
              >
                <FaUserMd className="text-slate-500 group-hover:text-slate-700" />
                <span>Doctor Portal</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ) : (
              <>
                <a
                  href="/chatbot"
                  onClick={(e) => {
                    e.preventDefault();
                    isAuthenticated ? navigate("/chatbot") : navigate("/signin");
                  }}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
                >
                  <FaRobot className="text-slate-500 group-hover:text-slate-700" />
                  <span>Health Assistant</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
                </a>

                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    isAuthenticated ? navigate("/register") : navigate("/signup");
                  }}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium text-lg relative group"
                >
                  <FaHospital className="text-slate-500 group-hover:text-slate-700" />
                  <span>Medical Records</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              </>
            )}
          </div>

          {/* Authentication Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            ) : (
              <>
                <a
                  href="/signin"
                  className="text-slate-700 hover:text-slate-900 font-semibold text-lg transition-colors duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4 pt-4">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                <FaHome className="text-slate-500" />
                Home
              </a>

              <a
                href="/scanner"
                onClick={(e) => {
                  e.preventDefault();
                  isAuthenticated ? navigate("/scanner") : navigate("/signin");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                <FaQrcode className="text-slate-500" />
                Health Card
              </a>

              <a 
                href="/calorieconvertor"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/calorieconvertor");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                <FaWeight className="text-slate-500" />
                Health Metrics
              </a>
              
              <a 
                href="/fitness"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/fitness");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                <FaRunning className="text-slate-500" />
                Fitness Plans
              </a>

              {userRole === "doctor" ? (
                <a 
                  href="/doctordashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/doctordashboard");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                >
                  <FaUserMd className="text-slate-500" />
                  Doctor Portal
                </a>
              ) : (
                <>
                  <a
                    href="/chatbot"
                    onClick={(e) => {
                      e.preventDefault();
                      isAuthenticated ? navigate("/chatbot") : navigate("/signin");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  >
                    <FaRobot className="text-slate-500" />
                    Health Assistant
                  </a>

                  <a
                    href="/register"
                    onClick={(e) => {
                      e.preventDefault();
                      isAuthenticated ? navigate("/register") : navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  >
                    <FaHospital className="text-slate-500" />
                    Medical Records
                  </a>
                </>
              )}

              <div className="pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <a
                      href="/signin"
                      className="text-slate-700 hover:text-slate-900 font-semibold text-center py-3 px-6 rounded-xl border border-slate-300 hover:border-slate-400 transition-colors duration-200"
                    >
                      Sign In
                    </a>
                    <a
                      href="/signup"
                      className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-center transition-all duration-200"
                    >
                      Get Started
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
