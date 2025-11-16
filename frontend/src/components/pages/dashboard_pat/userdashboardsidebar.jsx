import React from "react";
import { FaHome, FaCalendarCheck, FaFileMedical, FaUserMd, FaQrcode, FaRobot, FaCalculator, FaRunning, FaHeartbeat, FaBrain, FaLungs, FaDna, FaShieldAlt, FaCog, FaSignOutAlt, FaChartLine, FaStethoscope, FaPills, FaHospital, FaAmbulance, FaNotesMedical, FaCalendarAlt, FaWeight, FaFlask } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Userdashboardsidebar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      icon: FaHome,
      path: "/userdashboard",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Book Appointment",
      icon: FaCalendarCheck,
      path: "/bookappointment",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Medical Reports",
      icon: FaFileMedical,
      path: "/patientreport",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "My Doctors",
      icon: FaUserMd,
      path: "/mydoctors",
      color: "from-indigo-500 to-blue-500"
    },
    {
      name: "Health Card",
      icon: FaQrcode,
      path: "/scanner",
      color: "from-orange-500 to-red-500"
    }
  ];

  const healthTools = [
    {
      name: "AI Health Assistant",
      icon: FaRobot,
      path: "/chatbot",
      color: "from-purple-500 to-pink-500",
      description: "Get instant health advice"
    },
    {
      name: "Lab Report Analyzer",
      icon: FaFlask,
      path: "/labreport",
      color: "from-orange-500 to-red-500",
      description: "Analyze lab reports with desi remedies"
    },
    {
      name: "Calorie Calculator",
      icon: FaCalculator,
      path: "/calorieconvertor",
      color: "from-green-500 to-emerald-500",
      description: "Track your nutrition"
    },
    {
      name: "Fitness Tracker",
      icon: FaRunning,
      path: "/fitness",
      color: "from-blue-500 to-cyan-500",
      description: "Monitor your workouts"
    }
  ];

  const healthCategories = [
    {
      name: "Cardiology",
      icon: FaHeartbeat,
      color: "from-red-500 to-pink-500",
      description: "Heart health monitoring"
    },
    {
      name: "Neurology",
      icon: FaBrain,
      color: "from-purple-500 to-indigo-500",
      description: "Brain and nervous system"
    },
    {
      name: "Pulmonology",
      icon: FaLungs,
      color: "from-blue-500 to-cyan-500",
      description: "Respiratory health"
    },
    {
      name: "Genetics",
      icon: FaDna,
      color: "from-green-500 to-emerald-500",
      description: "Genetic testing & counseling"
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full bg-white shadow-lg border-r border-slate-200 p-6">
      <div className="max-w-sm mx-auto">
        {/* Portal Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaShieldAlt className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            ArogyaM Portal
          </h1>
          <p className="text-slate-600 text-sm font-medium">Patient Dashboard</p>
        </div>

        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Main Navigation
          </h3>
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.path)
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-white/20 text-white"
                    : `bg-gradient-to-br ${item.color} text-white group-hover:scale-110`
                }`}>
                  <item.icon className="text-sm" />
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Health Tools */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Health Tools
          </h3>
          <div className="space-y-3">
            {healthTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                className="group block bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-600">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Health Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Health Categories
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {healthCategories.map((category) => (
              <div
                key={category.name}
                className="group bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-3 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-center">
                  <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="text-white text-sm" />
                  </div>
                  <h4 className="font-medium text-slate-800 text-xs">{category.name}</h4>
                  <p className="text-xs text-slate-600 leading-tight">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <FaAmbulance className="text-sm" />
              Emergency Contact
            </button>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <FaNotesMedical className="text-sm" />
              Health Tips
            </button>
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="border-t border-slate-200 pt-6">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all duration-200">
              <FaCog className="text-sm" />
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200">
              <FaSignOutAlt className="text-sm" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Health Status Indicator */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-800">Health Status</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">Good</div>
            <p className="text-xs text-emerald-700">Your health metrics are within normal range</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdashboardsidebar;
