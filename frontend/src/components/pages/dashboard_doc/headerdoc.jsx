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
    <nav className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo1.png" alt="Arogyam Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Arogyam
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("/doctordashboard")}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <FaHome />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => handleNavigation("/appointment")}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <FaRegListAlt />
              <span>Appointments</span>
            </button>
            
            <button
              onClick={() => handleNavigation("/patient")}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <FaUsersCog />
              <span>My Patients</span>
            </button>
            
            <button
              onClick={() => handleNavigation("/conference")}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <FaMicrophoneAlt />
              <span>Conferences</span>
            </button>

            {/* Disease Selector Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                <FaStethoscope />
                <span>Disease Prediction</span>
                <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <button
                    onClick={() => handleDiseaseChange("pcod")}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    PCOD
                  </button>
                  <button
                    onClick={() => handleDiseaseChange("heartdisease")}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    Heart Disease
                  </button>
                  <button
                    onClick={() => handleDiseaseChange("pneumonia")}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    Pneumonia
                  </button>
                  <button
                    onClick={() => handleDiseaseChange("breastcancer")}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    Breast Cancer
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation("/blogging")}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <FaBloggerB />
              <span>Health Blog</span>
            </button>
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigation("/doctor/signin")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Doctor Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation("/doctordashboard")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
              >
                <FaHome className="inline mr-2" />
                Dashboard
              </button>
              
              <button
                onClick={() => handleNavigation("/appointment")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
              >
                <FaRegListAlt className="inline mr-2" />
                Appointments
              </button>
              
              <button
                onClick={() => handleNavigation("/patient")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
              >
                <FaUsersCog className="inline mr-2" />
                My Patients
              </button>
              
              <button
                onClick={() => handleNavigation("/conference")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
              >
                <FaMicrophoneAlt className="inline mr-2" />
                Conferences
              </button>
              
              <button
                onClick={() => handleNavigation("/blogging")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
              >
                <FaBloggerB className="inline mr-2" />
                Health Blog
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("/doctor/signin")}
                  className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Doctor Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DoctorHeader;
