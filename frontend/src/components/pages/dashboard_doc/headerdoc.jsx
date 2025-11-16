import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSelector from "../../language/LanguageSelector";
import { Home, Calendar, Users, LogOut, Stethoscope, Mic, FileText, Menu, X } from "lucide-react";

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
    <nav className="bg-white shadow-sm top-0 z-50 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="flex justify-between items-center h-16 gap-4">
      
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/doctordashboard")}
      >
        <div className="w-7 h-7 bg-emerald-600 rounded flex items-center justify-center">
          <Stethoscope className="text-white w-4 h-4" />
        </div>
        <h1 className="text-sm font-semibold text-gray-900">Arogyam</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-4 ml-6">
        {navItems.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => handleNavigation(path)}
            className={`flex items-center justify-center gap-2 h-11 px-4 rounded text-sm font-medium transition-colors ${
              isActivePath(path)
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}

        <button
          onClick={() => handleNavigation("/blogging")}
          className="flex items-center justify-center gap-2 h-11 px-4 rounded text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          <FileText className="w-4 h-4" />
          <span>Blog</span>
        </button>

        <div>
          <LanguageSelector variant="icon" />
        </div>
      </div>

      {/* Auth + Mobile Menu */}
      <div className="flex items-center gap-4">

        {/* Desktop Auth */}
        <div className="hidden lg:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white h-11 px-4 rounded text-sm font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigation("/doctor/signin")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-4 rounded text-sm font-medium"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 h-11 w-11 rounded hover:bg-gray-100 transition flex items-center justify-center"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="lg:hidden border-t border-gray-200 bg-white">
        <div className="py-2 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded transition-colors ${
                isActivePath(path)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}

          <button
            onClick={() => handleNavigation("/blogging")}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Blog</span>
          </button>

          <div className="border-t border-gray-200 pt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigation("/doctor/signin")}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium"
              >
                Login
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