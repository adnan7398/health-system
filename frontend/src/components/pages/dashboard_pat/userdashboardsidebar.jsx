import React from "react";
import { FaHome, FaCalendarCheck, FaFileMedical, FaUserMd, FaQrcode, FaRobot, FaCalculator, FaRunning, FaHeartbeat, FaBrain, FaLungs, FaDna, FaShieldAlt, FaCog, FaSignOutAlt, FaChartLine, FaStethoscope, FaPills, FaHospital, FaAmbulance, FaNotesMedical, FaCalendarAlt, FaWeight } from "react-icons/fa";
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
      name: "Calorie Calculator",
      icon: FaCalculator,
      path: "/calorieconverter",
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
    <div className="h-full bg-white border-r border-slate-200 p-6">
      {/* Portal Title */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <FaHospital className="text-white text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Health Portal</h2>
        <p className="text-slate-600 text-sm">Patient Dashboard</p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2 mb-8">
        <a
          href="/userDashboard"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaHome className="text-white text-sm" />
          </div>
          Dashboard
        </a>

        <a
          href="/bookappointment"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaCalendarCheck className="text-white text-sm" />
          </div>
          Book Appointment
        </a>

        <a
          href="/patientappointments"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaCalendarAlt className="text-white text-sm" />
          </div>
          My Appointments
        </a>

        <a
          href="/medicalReport"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaFileMedical className="text-white text-sm" />
          </div>
          Medical Reports
        </a>
      </nav>

      {/* Health Tools Section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 px-4">Health Tools</h3>
        <nav className="space-y-2">
          <a
            href="/chatbot"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FaRobot className="text-white text-sm" />
            </div>
            AI Assistant
          </a>

          <a
            href="/scanner"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FaQrcode className="text-white text-sm" />
            </div>
            QR Scanner
          </a>

          <a
            href="/calorieconvertor"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FaWeight className="text-white text-sm" />
            </div>
            Health Metrics
          </a>

          <a
            href="/fitness"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FaRunning className="text-white text-sm" />
            </div>
            Fitness Plans
          </a>
        </nav>
      </div>

      {/* Health Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 px-4">Health Categories</h3>
        <div className="space-y-2">
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Primary Care
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Specialists
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Diagnostics
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Wellness
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 px-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Emergency Contact
          </button>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            SOS Alert
          </button>
        </div>
      </div>

      {/* Health Status Indicator */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-800">System Status</span>
        </div>
        <p className="text-slate-600 text-xs">All services operational</p>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Last updated</span>
            <span className="text-slate-600 font-medium">2 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdashboardsidebar;
