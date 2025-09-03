import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaHome,
  FaQrcode,
  FaRobot,
  FaRunning,
  FaFlask,
  FaStethoscope,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import LanguageSelector from "../language/LanguageSelector";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      setIsAuthenticated(!!token);
    };

    checkAuth();
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
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleLoginDropdown = () =>
    setIsLoginDropdownOpen(!isLoginDropdownOpen);

  const handleNavigation = (path) => {
    if (path === "/") {
      navigate(path);
    } else if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/signin");
    }
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: FaHome, requiresAuth: false },
    {
      name: "Health Card",
      path: "/arogyamcard",
      icon: FaQrcode,
      requiresAuth: true,
    },
    {
      name: "Health Metrics",
      path: "/fitness",
      icon: FaStethoscope,
      requiresAuth: true,
    },
    {
      name: "Fitness Plans",
      path: "/fitness",
      icon: FaRunning,
      requiresAuth: true,
    },
    {
      name: "Health Assistant",
      path: "/chatbot",
      icon: FaRobot,
      requiresAuth: true,
    },
    {
      name: "Medical Records",
      path: "/medicalReport",
      icon: FaFlask,
      requiresAuth: true,
    },
  ];

  return (
    <nav className="bg-teal-700 shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <img src="logo1.png" alt="logo" className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Arogyam</h1>
          </div>

          {/* Center: Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                  className="flex flex-col items-center gap-1 text-white hover:text-teal-100 transition-colors duration-200 text-sm font-medium"
                >
                  <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center">
                    <item.icon className="text-white text-base" />
                  </div>
                  <span className="text-xs">{item.name}</span>
                  {!isAuthenticated && item.requiresAuth && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Language + Login/Profile */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSelector />
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 text-white hover:text-teal-100 transition-colors duration-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-teal-700 text-xs" />
                  </div>
                  <span>My Account</span>
                  <FaChevronDown className="text-white text-xs" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border py-2 z-50">
                    <a
                      href="/userdashboard"
                      className="px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <FaHome className="text-teal-600" />
                      Dashboard
                    </a>
                    <a
                      href="/patientappointments"
                      className="px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <FaCalendarCheck className="text-teal-600" />
                      My Appointments
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                    >
                      <FaUser className="text-red-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleLoginDropdown}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center space-x-1"
                >
                  <FaUser className="text-white text-xs" />
                  <span>Login</span>
                  <FaChevronDown className="text-white text-xs" />
                </button>
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border py-2 z-50">
                    <a
                      href="/signin"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Patient Login
                    </a>
                    <a
                      href="/doctorlogin"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Doctor Login
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-teal-100 p-2 rounded-lg hover:bg-white/10"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-teal-800 border-t border-teal-600">
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white relative text-sm"
                >
                  <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center">
                    <item.icon className="text-white text-sm" />
                  </div>
                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="space-y-2">
                <a
                  href="/userdashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-md text-sm"
                >
                  Dashboard
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-md text-sm"
                >
                  Login
                </button>
                {isLoginDropdownOpen && (
                  <div className="space-y-2 mt-2">
                    <a
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center bg-teal-400 hover:bg-teal-500 text-white py-2 px-6 rounded-md text-sm"
                    >
                      Patient Login
                    </a>
                    <a
                      href="/doctorlogin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center bg-teal-700 hover:bg-teal-800 text-white py-2 px-6 rounded-md text-sm"
                    >
                      Doctor Login
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
