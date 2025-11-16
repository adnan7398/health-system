import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "./DoctorLayout";
import { FaUserMd, FaCalendarAlt, FaUsers, FaBell, FaChartLine, FaStethoscope, FaHeartbeat, FaBrain, FaLungs, FaDna, FaQrcode, FaFileMedical, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: "Alice Johnson", time: "09:00 AM", type: "Consultation", status: "Confirmed" },
    { id: 2, patientName: "Bob Smith", time: "10:30 AM", type: "Follow-up", status: "Confirmed" },
    { id: 3, patientName: "Carol Davis", time: "02:00 PM", type: "Emergency", status: "Pending" },
    { id: 4, patientName: "David Wilson", time: "03:30 PM", type: "Consultation", status: "Confirmed" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New patient registration", time: "2 min ago", type: "info" },
    { id: 2, message: "Lab results ready for review", time: "15 min ago", type: "success" },
    { id: 3, message: "Appointment reminder", time: "1 hour ago", type: "warning" }
  ]);

  const stats = [
    { title: "Total Patients", value: "1,247", change: "+12%", icon: FaUsers, color: "from-teal-500 to-emerald-600" },
    { title: "Today's Appointments", value: "8", change: "+2", icon: FaCalendarAlt, color: "from-teal-500 to-emerald-500" },
    { title: "Pending Reports", value: "23", change: "-5", icon: FaFileMedical, color: "from-amber-500 to-orange-500" },
    { title: "Success Rate", value: "98.5%", change: "+1.2%", icon: FaChartLine, color: "from-emerald-500 to-teal-500" }
  ];

  const mlTools = [
    { name: "Pneumonia Detection", icon: FaLungs, description: "AI-powered X-ray analysis", path: "/pneumonia", color: "from-teal-500 to-emerald-600" },
    { name: "Heart Disease Risk", icon: FaHeartbeat, description: "Predictive cardiovascular assessment", path: "/heartdisease", color: "from-teal-500 to-emerald-600" },
    { name: "Breast Cancer Prediction", icon: FaDna, description: "Early detection using ML models", path: "/breastcancer", color: "from-teal-500 to-emerald-600" },
    { name: "PCOD Assessment", icon: FaBrain, description: "Polycystic ovary syndrome analysis", path: "/pcod", color: "from-teal-500 to-emerald-600" }
  ];

  const recentPatients = [
    { name: "Alice Johnson", age: 28, lastVisit: "2 days ago", status: "Active" },
    { name: "Bob Smith", age: 45, lastVisit: "1 week ago", status: "Active" },
    { name: "Carol Davis", age: 32, lastVisit: "3 days ago", status: "Follow-up" },
    { name: "David Wilson", age: 56, lastVisit: "1 day ago", status: "Active" }
  ];

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Welcome back, <span className="font-medium">Dr. Sarah Wilson</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaBell className="text-lg text-gray-600 cursor-pointer hover:text-gray-900" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <FaUserMd className="text-white text-sm" />
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg border border-teal-100 p-4 hover:shadow-md hover:border-teal-300 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <stat.icon className="text-white text-base" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-xs font-medium">{stat.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Calendar & Appointments */}
          <div className="lg:col-span-2 space-y-4">
            {/* Calendar */}
            <div className="bg-white rounded-lg border border-teal-100 p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-teal-600 text-sm" />
                Schedule
              </h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full border-0"
                tileClassName={({ date, view }) => {
                  if (view === 'month') {
                    const hasAppointment = appointments.some(apt => 
                      new Date(apt.date).toDateString() === date.toDateString()
                    );
                    return hasAppointment ? 'bg-emerald-100 text-emerald-800 rounded' : '';
                  }
                }}
              />
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-lg border border-teal-100 p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-teal-600 text-sm" />
                Today's Appointments
              </h2>
              <div className="space-y-2">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-teal-50 rounded-lg p-3 border border-teal-100 hover:bg-teal-100 hover:border-teal-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                          <FaUserMd className="text-white text-sm" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{appointment.patientName}</h3>
                          <p className="text-xs text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{appointment.time}</div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Tools & Notifications */}
          <div className="space-y-4">
            {/* ML Tools */}
            <div className="bg-white rounded-lg border border-teal-100 p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaStethoscope className="text-teal-600 text-sm" />
                AI Tools
              </h2>
              <div className="space-y-2">
                {mlTools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(tool.path)}
                    className="group block w-full text-left bg-teal-50 rounded-lg p-3 border border-teal-100 hover:bg-teal-100 hover:border-teal-300 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center shadow-sm`}>
                        <tool.icon className="text-white text-base" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">{tool.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-lg border border-teal-100 p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaUsers className="text-teal-600 text-sm" />
                Recent Patients
              </h2>
              <div className="space-y-2">
                {recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 bg-teal-50 rounded-lg hover:bg-teal-100 border border-teal-100 hover:border-teal-200 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-xs">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{patient.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{patient.age} years • {patient.lastVisit}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      patient.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border border-teal-100 p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaBell className="text-teal-600 text-sm" />
                Notifications
              </h2>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-2 p-2.5 bg-teal-50 rounded-lg hover:bg-teal-100 border border-teal-100 hover:border-teal-200 transition-all duration-300">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      notification.type === 'success' ? 'bg-emerald-500' :
                      notification.type === 'warning' ? 'bg-amber-500' : 'bg-teal-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 bg-white rounded-lg border border-teal-100 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button 
              onClick={() => navigate("/scanner")}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-md"
            >
              <FaQrcode className="text-sm" />
              <span>Scan QR</span>
            </button>
            <button 
              onClick={() => navigate("/patientreport")}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-md"
            >
              <FaFileMedical className="text-sm" />
              <span>Reports</span>
            </button>
            <button 
              onClick={() => navigate("/appointment")}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-md"
            >
              <FaCalendarAlt className="text-sm" />
              <span>Schedule</span>
            </button>
            <button 
              onClick={() => navigate("/patient")}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-md"
            >
              <FaUsers className="text-sm" />
              <span>Patients</span>
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
