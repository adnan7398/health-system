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
  FaBlog,
} from "react-icons/fa";

import LanguageSelector from "../language/LanguageSelector";
import { ThemeToggle } from "../ui/theme-toggle";

const Header = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      let userInfoStr = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
      let userInfoObj = null;
      if (userInfoStr) {
        try {
          userInfoObj = JSON.parse(userInfoStr);
        } catch (e) {
          console.error("Error parsing userInfo:", e);
        }
      }

      setIsAuthenticated(!!token);
      setUserInfo(userInfoObj);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 500);
    window.addEventListener("storage", checkAuth);
    window.addEventListener("localStorageChange", checkAuth);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("localStorageChange", checkAuth);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  /* Define navigation items based on current path */
  const getNavigationItems = () => {
    // If on landing page, show only Chatbot and Blogs
    if (location.pathname === "/") {
      return [
        { name: t("nav.healthAssistant"), path: "/chatbot", icon: FaRobot, requiresAuth: true },
        { name: "Blogs", path: "/blogging", icon: FaBlog, requiresAuth: false },
      ];
    }

    // Default navigation for other pages
    return [
      { name: t("nav.home"), path: "/", icon: FaHome, requiresAuth: false },
      { name: t("nav.healthCard"), path: "/arogyamcard", icon: FaQrcode, requiresAuth: true },
      { name: t("nav.healthMetrics"), path: "/fitness", icon: FaStethoscope, requiresAuth: true },
      { name: t("nav.healthAssistant"), path: "/chatbot", icon: FaRobot, requiresAuth: true },
      { name: t("nav.medicalRecords"), path: "/medicalReport", icon: FaFlask, requiresAuth: true },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 will-change-transform ${scrolled
        ? "bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-gray-100/50 dark:border-surface-800/50 py-3"
        : "bg-white/0 border-b border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
              <FaHeartbeat className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-heading group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
              Arogyam
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center bg-gray-50/50 dark:bg-surface-900/50 rounded-full px-2 py-1 border border-gray-100/50 dark:border-surface-800/50 backdrop-blur-sm">
            {navigationItems.map((item) => {
              const isActive = item.path === location.pathname;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                  className={`
                            relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2
                            ${isActive
                      ? "text-primary-700 bg-white shadow-sm ring-1 ring-gray-100"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    }
                        `}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className={`text-md ${isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                    {item.name}
                  </span>
                </a>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSelector variant="icon" />

            {isAuthenticated ? (
              <div className="relative pl-2">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary-200 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-full flex items-center justify-center shadow-sm">
                    <FaUser className="text-xs" />
                  </div>
                  <div className="flex flex-col items-start pr-2">
                    <span className="text-sm font-semibold text-gray-700 leading-none">{userInfo?.name?.split(' ')[0] || "User"}</span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">PATIENT</span>
                  </div>
                  <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{userInfo?.email || userInfo?.name}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <button onClick={() => { setIsDropdownOpen(false); handleNavigation("/userdashboard"); }} className="w-full text-left px-4 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-3 transition-colors">
                        <FaHome className="text-gray-400" /> {t("header.dashboard")}
                      </button>
                      <button onClick={() => { setIsDropdownOpen(false); handleNavigation("/patientappointments"); }} className="w-full text-left px-4 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-3 transition-colors">
                        <FaCalendarCheck className="text-gray-400" /> {t("header.myAppointments")}
                      </button>
                      <button onClick={() => { setIsDropdownOpen(false); handleNavigation("/medicalReport"); }} className="w-full text-left px-4 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-3 transition-colors">
                        <FaFlask className="text-gray-400" /> {t("header.medicalRecords")}
                      </button>
                    </div>

                    <div className="border-t border-gray-100 my-1 mx-2"></div>
                    <div className="p-2">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium">
                        <FaTimes className="text-red-400" /> {t("common.logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/signin")}
                  className="text-gray-600 hover:text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-300"
                >
                  {t("auth.patientLogin")}
                </button>
                <button
                  onClick={() => navigate("/doctor/signin")}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5"
                >
                  {t("auth.doctorLogin")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Kept same but refined padding */}
          <button onClick={toggleMenu} className="lg:hidden text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Refined */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-2xl h-screen z-50">
          {/* ... existing mobile menu content, keeping logic roughly same but ensures updated classes flow down ... */}
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                  className={`flex items-center gap-4 py-4 px-5 rounded-2xl transition-all ${item.path === location.pathname
                    ? "bg-primary-50 text-primary-700 font-bold shadow-sm ring-1 ring-primary-100"
                    : "text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                >
                  <item.icon className={`text-xl ${item.path === location.pathname ? "text-primary-600" : "text-gray-400"}`} />
                  <span className="text-base">{item.name}</span>
                </a>
              ))}
            </div>
            {/* ... user auth mobile part ... */}
            <div className="border-t border-gray-100 pt-6 mt-4">
              {isAuthenticated ? (
                /* ... existing authenticated mobile view ... */
                <>
                  <div className="px-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                      {userInfo?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900">{userInfo?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsMenuOpen(false); handleNavigation("/userdashboard"); }} className="w-full text-left flex items-center gap-4 py-3 px-5 text-gray-600 hover:bg-gray-50 rounded-2xl font-medium">
                    <FaHome className="text-gray-400 text-lg" /> {t("header.dashboard")}
                  </button>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-4 py-3 px-5 text-red-600 hover:bg-red-50 rounded-2xl font-medium mt-2">
                    <FaTimes className="text-red-400 text-lg" /> {t("common.logout")}
                  </button>
                </>
              ) : (
                <div className="space-y-3 px-1">
                  <button onClick={() => navigate("/signin")} className="w-full py-3.5 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                    {t("auth.patientLogin")}
                  </button>
                  <button onClick={() => navigate("/doctor/signin")} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
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
