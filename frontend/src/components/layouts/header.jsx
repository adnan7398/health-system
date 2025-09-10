import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
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
  FaHeartbeat,
} from "react-icons/fa";

import LanguageSelector from "../language/LanguageSelector";

const Header = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "Home";
      case "/userdashboard":
        return "Dashboard";
      case "/bookappointment":
        return "Book Appointment";
      case "/patientreport":
      case "/medicalReport":
        return "Medical Reports";
      case "/chatbot":
        return "AI Health Assistant";
      case "/arogyamcard":
        return "Health Card";
      case "/fitness":
        return "Fitness & Wellness";
      case "/scanner":
        return "QR Scanner";
      case "/patientappointments":
        return "My Appointments";
      case "/alldoctors":
        return "Find Doctors";
      case "/blogging":
        return "Health Blog";
      case "/calorieconvertor":
        return "Calorie Converter";
      case "/qrform":
        return "QR Form";
      case "/qrscanner":
        return "QR Scanner";
      case "/summarizer":
        return "Report Summarizer";
      case "/verifyauth":
        return "Verify Authentication";
      default:
        return "Arogyam";
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      setIsAuthenticated(!!token);
      setUserRole(role);
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

  const handleNavigation = (path) => {
    // Always delegate access control to route guards
    navigate(path);
  };

  const navigationItems = [
    { name: t("nav.home"), path: "/", icon: FaHome, requiresAuth: false },
    {
      name: t("nav.healthCard"),
      path: "/arogyamcard",
      icon: FaQrcode,
      requiresAuth: true,
    },
    {
      name: t("nav.healthMetrics"),
      path: "/fitness",
      icon: FaStethoscope,
      requiresAuth: true,
    },
    {
      name: t("nav.fitnessPlans"),
      path: "/fitness",
      icon: FaRunning,
      requiresAuth: true,
    },
    {
      name: t("nav.healthAssistant"),
      path: "/chatbot",
      icon: FaRobot,
      requiresAuth: true,
    },
    {
      name: t("nav.medicalRecords"),
      path: "/medicalReport",
      icon: FaFlask,
      requiresAuth: true,
    },
  ];

  return (
    <nav className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#004466] shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mr-10 -ml-25">
            <div
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="/logo1.png" // Replace with your logo path
                alt="Arogyam Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Arogyam
              </h1>
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
                {item.path === location.pathname && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-white rounded-full"></div>
                )}
                {/* Removed auth-required red dot for a cleaner professional header */}
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSelector variant="icon" />
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-white hover:text-teal-100 transition-colors duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/10 shadow-none focus:outline-none focus:ring-0"
                >
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-teal-700 text-sm" />
                  </div>
                  <span className="font-medium text-sm">
                    {t("header.myAccount")}
                  </span>
                  <FaChevronDown className="text-white text-xs" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600 font-medium">
                        {t("header.welcomeBack")}
                      </p>
                    </div>
                    <a
                      href="/userdashboard"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaHome className="text-teal-600 text-sm" />
                      <span className="text-sm">{t("header.dashboard")}</span>
                    </a>
                    <a
                      href="/patientappointments"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaCalendarCheck className="text-teal-600 text-sm" />
                      <span className="text-sm">
                        {t("header.myAppointments")}
                      </span>
                    </a>
                    <a
                      href="/medicalReport"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaFlask className="text-teal-600 text-sm" />
                      <span className="text-sm">
                        {t("header.medicalRecords")}
                      </span>
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaTimes className="text-red-600 text-sm" />
                      <span className="text-sm">{t("common.logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-white border border-white/10 shadow-none focus:outline-none focus:ring-0 bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                >
                  <span>{t("Login")}</span>
                  <FaChevronDown className="text-white text-xs" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/signin");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaUser className="text-teal-600 text-sm" />
                      <span className="text-sm">{t("auth.patientLogin")}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/doctor/signin");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaStethoscope className="text-teal-600 text-sm" />
                      <span className="text-sm">{t("auth.doctorLogin")}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-teal-100 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Removed page title strip below header for cleaner single-header layout */}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-teal-800 border-t border-teal-600">
          <div className="px-6 py-4 space-y-3">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.path);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-white hover:text-teal-100 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-white/10"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <item.icon className="text-white text-sm" />
                </div>
                <span className="font-medium">{item.name}</span>
              </a>
            ))}

            <div className="border-t border-teal-600 pt-3 mt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <a
                    href="/userdashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-white hover:text-teal-100 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-white/10"
                  >
                    <FaHome className="text-white text-sm" />
                    <span>{t("header.dashboard")}</span>
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 text-red-300 hover:text-red-100 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-red-500/20"
                  >
                    <FaTimes className="text-red-300 text-sm" />
                    <span>{t("common.logout")}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-none focus:outline-none focus:ring-0 ${
                      location.pathname === "/signin"
                        ? "bg-green-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {t("auth.patientLogin")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/doctorlogin");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-none focus:outline-none focus:ring-0 ${
                      location.pathname === "/doctorlogin"
                        ? "bg-green-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {t("auth.doctorLogin")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
