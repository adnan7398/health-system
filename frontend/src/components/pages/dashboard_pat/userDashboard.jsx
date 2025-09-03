import React, { useState, useEffect } from "react";
import { FaNotesMedical, FaCalendarCheck, FaUserMd, FaHeartbeat, FaFileMedical, FaHistory, FaBell, FaChartLine, FaShieldAlt, FaQrcode, FaRobot, FaWeight, FaRunning, FaThermometerHalf, FaTint, FaLungs, FaBrain } from "react-icons/fa";
import UserSidebar from "./usersidebar";
import Userdashboardsidebar from "./userdashboardsidebar";

const UserDashboard = () => {
  const [userName, setUserName] = useState("John Doe");
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiologist", date: "2023-10-15", time: "10:30 AM", status: "Confirmed" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Neurologist", date: "2023-10-22", time: "2:00 PM", status: "Pending" }
  ]);
  
  const [recentReports, setRecentReports] = useState([
    { id: 1, title: "Blood Test Results", date: "2023-09-30", status: "Completed", type: "Laboratory" },
    { id: 2, title: "Chest X-Ray", date: "2023-09-15", status: "Completed", type: "Imaging" },
    { id: 3, title: "ECG Report", date: "2023-08-22", status: "Completed", type: "Cardiology" }
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: "72 bpm",
    bloodPressure: "120/80 mmHg",
    weight: "68 kg",
    height: "175 cm",
    bmi: "22.2",
    temperature: "36.8°C",
    oxygenSaturation: "98%"
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "appointment", message: "Appointment booked with Dr. Sarah Wilson", time: "2 days ago", icon: FaCalendarCheck, color: "from-blue-500 to-cyan-500" },
    { id: 2, type: "report", message: "Blood Test Results uploaded", time: "5 days ago", icon: FaFileMedical, color: "from-green-500 to-emerald-500" },
    { id: 3, type: "consultation", message: "Consultation with Dr. Michael Chen completed", time: "1 week ago", icon: FaUserMd, color: "from-purple-500 to-pink-500" }
  ]);

  const quickActions = [
    { name: "Book Appointment", icon: FaCalendarCheck, path: "/bookappointment", color: "from-blue-500 to-cyan-500" },
    { name: "View Reports", icon: FaFileMedical, path: "/patientreport", color: "from-green-500 to-emerald-500" },
    { name: "AI Health Assistant", icon: FaRobot, path: "/chatbot", color: "from-purple-500 to-pink-500" },
    { name: "Health Card", icon: FaQrcode, path: "/scanner", color: "from-orange-500 to-red-500" }
  ];

  const healthTips = [
    { title: "Stay Hydrated", description: "Drink 8 glasses of water daily", icon: FaTint, color: "from-blue-500 to-cyan-500" },
    { title: "Regular Exercise", description: "30 minutes of moderate activity", icon: FaRunning, color: "from-green-500 to-emerald-500" },
    { title: "Healthy Sleep", description: "7-9 hours of quality sleep", icon: FaBrain, color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Sidebar - Navigation Links */}
      <div className="w-64 bg-white shadow-lg border-r border-slate-200">
        <Userdashboardsidebar />
      </div> 
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Patient Dashboard
                </h1>
                <p className="text-slate-600 text-lg">
                  Welcome back, <span className="font-semibold text-blue-600">{userName}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaBell className="text-2xl text-slate-600 cursor-pointer hover:text-blue-600 transition-colors duration-200" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <FaUserMd className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.path}
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                      {action.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Heart Rate</p>
                  <p className="text-2xl font-bold text-slate-800">{healthMetrics.heartRate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FaThermometerHalf className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Blood Pressure</p>
                  <p className="text-2xl font-bold text-slate-800">{healthMetrics.bloodPressure}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <FaWeight className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Weight</p>
                  <p className="text-2xl font-bold text-slate-800">{healthMetrics.weight}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <FaTint className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Oxygen</p>
                  <p className="text-2xl font-bold text-slate-800">{healthMetrics.oxygenSaturation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Upcoming Appointments</h2>
                <a href="/bookappointment" className="text-slate-600 hover:text-slate-800 font-medium">
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                        <FaCalendarCheck className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{appointment.doctor}</h3>
                        <p className="text-slate-600">{appointment.specialty}</p>
                        <p className="text-sm text-slate-500">{appointment.date} at {appointment.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Medical Reports */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Reports</h2>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                      <FaFileMedical className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{report.title}</h3>
                      <p className="text-sm text-slate-600">{report.type}</p>
                      <p className="text-xs text-slate-500">{report.date}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center`}>
                    <activity.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{activity.message}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Tips */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Health Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {healthTips.map((tip, index) => (
                <div key={index} className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <tip.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{tip.title}</h3>
                  <p className="text-slate-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
