import React, { useState, useEffect } from "react";
import { FaNotesMedical, FaCalendarCheck, FaUserMd, FaHeartbeat, FaFileMedical, FaHistory, FaBell, FaChartLine, FaShieldAlt, FaQrcode, FaRobot, FaWeight, FaRunning, FaThermometerHalf, FaTint, FaLungs, FaBrain, FaArrowRight, FaClock, FaUser, FaFlask, FaStethoscope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
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
    { id: 1, type: "appointment", message: "Appointment booked with Dr. Sarah Wilson", time: "2 days ago", icon: FaCalendarCheck, color: "from-teal-500 to-teal-600" },
    { id: 2, type: "report", message: "Blood Test Results uploaded", time: "5 days ago", icon: FaFileMedical, color: "from-teal-500 to-teal-600" },
    { id: 3, type: "consultation", message: "Consultation with Dr. Michael Chen completed", time: "1 week ago", icon: FaUserMd, color: "from-teal-500 to-teal-600" }
  ]);

  const quickActions = [
    { name: "Book Appointment", icon: FaCalendarCheck, path: "/bookappointment", color: "from-teal-500 to-teal-600" },
    { name: "View Reports", icon: FaFileMedical, path: "/patientreport", color: "from-teal-500 to-teal-600" },
    { name: "AI Health Assistant", icon: FaRobot, path: "/chatbot", color: "from-teal-500 to-teal-600" },
    { name: "Health Card", icon: FaQrcode, path: "/scanner", color: "from-teal-500 to-teal-600" }
  ];

  const healthTips = [
    { title: "Stay Hydrated", description: "Drink 8 glasses of water daily", icon: FaTint, color: "from-teal-500 to-teal-600" },
    { title: "Regular Exercise", description: "30 minutes of moderate activity", icon: FaRunning, color: "from-teal-500 to-teal-600" },
    { title: "Healthy Sleep", description: "7-9 hours of quality sleep", icon: FaBrain, color: "from-teal-500 to-teal-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access your most frequently used health features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <action.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-100 transition-colors duration-200">
                  {action.name}
                </h3>
                <p className="text-teal-100 text-sm">{action.description || action.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Metrics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Metrics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Monitor your vital signs and health indicators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaHeartbeat className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{healthMetrics.heartRate}</h3>
              <p className="text-gray-600">Heart Rate</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaThermometerHalf className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{healthMetrics.bloodPressure}</h3>
              <p className="text-gray-600">Blood Pressure</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaWeight className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{healthMetrics.bmi}</h3>
              <p className="text-gray-600">BMI</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaTint className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{healthMetrics.oxygenSaturation}</h3>
              <p className="text-gray-600">Oxygen Level</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay on top of your scheduled consultations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <FaUserMd className="text-xl text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarCheck className="text-teal-500" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-teal-500" />
                    {appointment.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Reports</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access your latest medical reports and results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentReports.map((report, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FaFileMedical className="text-lg text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{report.date}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Tips</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple tips to maintain your health and wellness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {healthTips.map((tip, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="text-2xl text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Need Medical Assistance?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Connect with our AI Health Assistant or book an appointment with a specialist
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/chatbot" className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg">
              Ask AI Assistant
            </a>
            <a href="/bookappointment" className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300">
              Book Appointment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
