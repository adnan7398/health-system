import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarAlt, FaUsers, FaBell, FaChartLine, FaStethoscope, FaHeartbeat, FaBrain, FaLungs, FaDna, FaQrcode, FaFileMedical, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DoctorDashboard = () => {
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
    { title: "Total Patients", value: "1,247", change: "+12%", icon: FaUsers, color: "from-emerald-500 to-teal-600" },
    { title: "Today's Appointments", value: "8", change: "+2", icon: FaCalendarAlt, color: "from-emerald-500 to-teal-500" },
    { title: "Pending Reports", value: "23", change: "-5", icon: FaFileMedical, color: "from-orange-500 to-red-500" },
    { title: "Success Rate", value: "98.5%", change: "+1.2%", icon: FaChartLine, color: "from-purple-500 to-pink-500" }
  ];

  const mlTools = [
    { name: "Pneumonia Detection", icon: FaLungs, description: "AI-powered X-ray analysis", path: "/pneumonia", color: "from-emerald-500 to-teal-600" },
    { name: "Heart Disease Risk", icon: FaHeartbeat, description: "Predictive cardiovascular assessment", path: "/heartdisease", color: "from-red-500 to-pink-500" },
    { name: "Breast Cancer Prediction", icon: FaDna, description: "Early detection using ML models", path: "/breastcancer", color: "from-pink-500 to-purple-500" },
    { name: "PCOD Assessment", icon: FaBrain, description: "Polycystic ovary syndrome analysis", path: "/pcod", color: "from-purple-500 to-indigo-500" }
  ];

  const recentPatients = [
    { name: "Alice Johnson", age: 28, lastVisit: "2 days ago", status: "Active" },
    { name: "Bob Smith", age: 45, lastVisit: "1 week ago", status: "Active" },
    { name: "Carol Davis", age: 32, lastVisit: "3 days ago", status: "Follow-up" },
    { name: "David Wilson", age: 56, lastVisit: "1 day ago", status: "Active" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Doctor Dashboard
                </h1>
                <p className="text-teal-100 text-lg">
                  Welcome back, <span className="font-semibold text-white">Dr. Sarah Wilson</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaBell className="text-2xl text-white cursor-pointer hover:text-teal-100 transition-colors duration-200" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FaUserMd className="text-white text-xl" />
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="text-white text-xl" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-emerald-200' : 'text-red-200'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-teal-100 text-sm">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Calendar & Appointments */}
            <div className="lg:col-span-2 space-y-8">
              {/* Calendar */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <FaCalendarAlt className="text-emerald-600" />
                  Schedule Calendar
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    className="w-full border-0 bg-transparent"
                    tileClassName={({ date, view }) => {
                      if (view === 'month') {
                        const hasAppointment = appointments.some(apt => 
                          new Date(apt.date).toDateString() === date.toDateString()
                        );
                        return hasAppointment ? 'bg-emerald-100 text-emerald-800 rounded-lg' : '';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <FaClock className="text-emerald-600" />
                  Today's Appointments
                </h2>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <FaUserMd className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{appointment.patientName}</h3>
                            <p className="text-sm text-slate-600">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-slate-800">{appointment.time}</div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
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
            <div className="space-y-8">
              {/* ML Tools */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <FaStethoscope className="text-purple-600" />
                  AI Medical Tools
                </h2>
                <div className="space-y-4">
                  {mlTools.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.path}
                      className="group block bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <tool.icon className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-slate-600">{tool.description}</p>
                        </div>
                        <div className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-200">
                          →
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <FaUsers className="text-green-600" />
                  Recent Patients
                </h2>
                <div className="space-y-4">
                  {recentPatients.map((patient, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{patient.name}</h4>
                        <p className="text-sm text-slate-600">{patient.age} years • {patient.lastVisit}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <FaBell className="text-orange-600" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-emerald-500' :
                        notification.type === 'warning' ? 'bg-amber-500' : 'bg-teal-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{notification.message}</p>
                        <p className="text-xs text-slate-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <FaQrcode className="text-xl" />
                <span>Scan Patient QR</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <FaFileMedical className="text-xl" />
                <span>View Reports</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <FaCalendarAlt className="text-xl" />
                <span>Schedule</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <FaUsers className="text-xl" />
                <span>Patients</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
