import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSelector from "../../language/LanguageSelector";
import { Home, Calendar, Users, LogOut, Stethoscope, ChevronDown, Mic, FileText, Guitar as Hospital, Menu, X } from "lucide-react";

const DoctorHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActivePath = (path) => location.pathname === path;

  const navItems = [
    { path: "/doctordashboard", label: "Dashboard", icon: Home },
    { path: "/appointment", label: "Appointments", icon: Calendar },
    { path: "/patient", label: "My Patients", icon: Users },
    { path: "/conference", label: "Conferences", icon: Mic },
  ];

  const diseaseOptions = [
    { value: "pcod", label: "PCOD Analysis" },
    { value: "heartdisease", label: "Heart Disease" },
    { value: "pneumonia", label: "Pneumonia Detection" },
    { value: "breastcancer", label: "Breast Cancer Screening" },
  ];

  return (
    <nav className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 shadow-xl sticky top-0 z-50 border-b border-emerald-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-white to-emerald-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-white/20"
              onClick={() => navigate("/")}
            >
              <Hospital className="text-emerald-700 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Arogyam</h1>
              <p className="text-emerald-100 text-sm font-medium">Medical Professional Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium group ${
                  isActivePath(path)
                    ? "bg-white/15 text-white shadow-lg"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-sm">{label}</span>
              </button>
            ))}

            {/* Disease Prediction Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium group"
              >
                <Stethoscope className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-sm">Diagnostics</span>
                <ChevronDown className={`w-4 h-4 transition-all duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-emerald-100 py-2 z-50 backdrop-blur-sm">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disease Prediction Tools</p>
                  </div>
                  {diseaseOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleDiseaseChange(value)}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 text-sm font-medium"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation("/blogging")}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium group"
            >
              <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-sm">Health Blog</span>
            </button>

            <div className="px-2">
              <LanguageSelector variant="icon" />
            </div>
          </div>

          {/* Authentication & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth Button */}
            <div className="hidden lg:flex">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("/doctor/signin")}
                  className="bg-white text-emerald-700 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-emerald-50 border border-white/20"
                >
                  <span className="text-sm">Doctor Login</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-emerald-100 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-emerald-600/30 bg-emerald-800/95 backdrop-blur-sm">
            <div className="py-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => handleNavigation(path)}
                  className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActivePath(path)
                      ? "bg-white/15 text-white"
                      : "text-emerald-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              <div className="px-4 py-2">
                <p className="text-emerald-200 text-sm font-medium mb-2">Disease Prediction</p>
                <div className="space-y-1 pl-4">
                  {diseaseOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleDiseaseChange(value)}
                      className="block w-full text-left py-2 text-emerald-100 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleNavigation("/blogging")}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Health Blog</span>
              </button>
              
              <div className="pt-4 border-t border-emerald-600/30 mt-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation("/doctor/signin")}
                    className="flex items-center justify-center w-full px-4 py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold"
                  >
                    Doctor Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DoctorHeader;