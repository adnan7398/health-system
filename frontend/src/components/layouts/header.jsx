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
  FaPills,
  FaFlask,
  FaStethoscope,
  FaUserFriends,
  FaSearch,
  FaBell,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaLeaf
} from "react-icons/fa";

import LanguageSelector from "../language/LanguageSelector";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  // Function to handle navigation with authentication check
  const handleNavigation = (path) => {
    if (path === "/") {
      // Home page is always accessible
      navigate(path);
    } else if (isAuthenticated) {
      // If authenticated, navigate to the requested path
      navigate(path);
    } else {
      // If not authenticated, redirect to login page
      navigate("/signin");
    }
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: FaHome, requiresAuth: false },
    { name: "Health Card", path: "/arogyamcard", icon: FaQrcode, requiresAuth: true },
    { name: "Health Metrics", path: "/fitness", icon: FaStethoscope, requiresAuth: true },
    { name: "Fitness Plans", path: "/fitness", icon: FaRunning, requiresAuth: true },
    { name: "Health Assistant", path: "/chatbot", icon: FaRobot, requiresAuth: true },
    { name: "Medical Records", path: "/medicalReport", icon: FaFlask, requiresAuth: true }
  ];

  return (
    <nav className="bg-teal-700 shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer" onClick={() => navigate("/")}>
              <FaHeartbeat className="text-teal-700 text-2xl" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-3xl font-bold text-white tracking-tight">Arogyam</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.path);
                }}
                className="flex flex-col items-center gap-1.5 text-white hover:text-teal-100 transition-colors duration-200 font-medium relative group cursor-pointer"
              >
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <item.icon className="text-white text-lg" />
                </div>
                <span className="text-sm">{item.name}</span>
                {item.name === "Home" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-white rounded-full"></div>
                )}
                {!isAuthenticated && item.requiresAuth && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                )}
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSelector />
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-white hover:text-teal-100 transition-colors duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                >
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-teal-700 text-sm" />
                  </div>
                  <span className="font-medium text-sm">My Account</span>
                  <FaChevronDown className="text-white text-xs" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600 font-medium">Welcome back!</p>
                    </div>
                    <a
                      href="/userdashboard"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaHome className="text-teal-600 text-sm" />
                      <span className="text-sm">Dashboard</span>
                    </a>
                    <a
                      href="/patientappointments"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaCalendarCheck className="text-teal-600 text-sm" />
                      <span className="text-sm">My Appointments</span>
                    </a>
                    <a
                      href="/arogyamcard"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaQrcode className="text-teal-600 text-sm" />
                      <span className="text-sm">Health Records</span>
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaUser className="text-red-500 text-sm" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/signin"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 shadow-md"
                >
                  Patient Login
                </a>
                <a
                  href="/doctorlogin"
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 shadow-md"
                >
                  Doctor Login
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-teal-100 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-teal-800 border-t border-teal-600">
          <div className="px-6 py-4">
            {/* Mobile Navigation */}
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
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white relative"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <item.icon className="text-white text-base" />
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                  {!isAuthenticated && item.requiresAuth && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <a
                  href="/userdashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white py-2.5 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <a
                  href="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white py-2.5 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  Patient Login
                </a>
                <a
                  href="/doctorlogin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-teal-800 hover:bg-teal-900 text-white py-2.5 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  Doctor Login
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
