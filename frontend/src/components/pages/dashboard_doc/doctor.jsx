import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoctorSidebar from "./doctorsidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  FaUserMd, 
  FaCalendarPlus, 
  FaLungs, 
  FaHeartbeat, 
  FaMicroscope, 
  FaVenus, 
  FaUserInjured, 
  FaCalendarCheck, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaStethoscope, 
  FaHospital,
  FaBell,
  FaUserPlus
} from "react-icons/fa";

// Sample data for the doctor dashboard
const appointments = [
  {
    time: "09:00 AM",
    patient: "John Doe",
    condition: "Flu",
    status: "Confirmed",
  },
  {
    time: "10:30 AM",
    patient: "Emily Smith",
    condition: "Migraine",
    status: "Pending",
  },
  {
    time: "12:00 PM",
    patient: "Michael Johnson",
    condition: "Diabetes",
    status: "Confirmed",
  },
  {
    time: "02:00 PM",
    patient: "Sarah Williams",
    condition: "Back Pain",
    status: "Canceled",
  },
  {
    time: "03:30 PM",
    patient: "David Brown",
    condition: "Hypertension",
    status: "Confirmed",
  },
  {
    time: "04:45 PM",
    patient: "Sophia Martinez",
    condition: "Asthma",
    status: "Pending",
  },
  {
    time: "06:00 PM",
    patient: "James Wilson",
    condition: "Allergy",
    status: "Confirmed",
  },
  {
    time: "07:15 PM",
    patient: "Olivia Taylor",
    condition: "Fever",
    status: "Canceled",
  },
];

// Notification data for the dashboard
const notifications = [
  {
    type: "new_patient",
    message: "New patient registered:",
    subject: "Daniel Green"
  },
  {
    type: "reschedule",
    message: "Appointment rescheduled:",
    subject: "Sarah Williams"
  },
  {
    type: "completed",
    message: "Appointment completed:",
    subject: "Michael Johnson"
  },
  {
    type: "results",
    message: "New lab results available:",
    subject: "James Wilson"
  }
];

const DoctorDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalPatients: 72,
    todaysAppointments: 8,
    completed: 4,
    pending: 2,
    specialization: "Neurologist", 
    hospital: "City Medical Center"
  });
  
  // Simulate loading stats from API
  useEffect(() => {
    // This would be replaced with an actual API call
    // fetchDoctorStats().then(data => setStats(data));
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DoctorSidebar />
      <div className="flex-1 ml-64 p-6 transition-all duration-300">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaUserMd className="text-blue-600" />
              Doctor Dashboard
            </h1>
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <FaCalendarPlus />
              Add Appointment
            </button>
          </div>
        </header>
        
        {/* ML Tools Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Link to="/pneumonia" className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-all duration-300 whitespace-nowrap">
              <FaLungs />
              Pneumonia Detection
            </Link>
            <Link to="/heartdisease" className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-all duration-300 whitespace-nowrap">
              <FaHeartbeat />
              Heart Disease
            </Link>
            <Link to="/breastcancer" className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-all duration-300 whitespace-nowrap">
              <FaMicroscope />
              Breast Cancer
            </Link>
            <Link to="/pcod" className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-all duration-300 whitespace-nowrap">
              <FaVenus />
              PCOD
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUserInjured className="text-white text-xl" />
            </div>
            <div className="text-sm text-slate-600 font-medium mb-2">Total Patients</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPatients}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaCalendarCheck className="text-white text-xl" />
            </div>
            <div className="text-sm text-slate-600 font-medium mb-2">Today's Appointments</div>
            <div className="text-2xl font-bold text-blue-600">{stats.todaysAppointments}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <div className="text-sm text-slate-600 font-medium mb-2">Completed</div>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaHourglassHalf className="text-white text-xl" />
            </div>
            <div className="text-sm text-slate-600 font-medium mb-2">Pending</div>
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaStethoscope className="text-white text-xl" />
            </div>
            <div className="text-sm text-slate-600 font-medium mb-2">Specialization</div>
            <div className="text-2xl font-bold text-blue-600">{stats.specialization}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaHospital className="text-white text-xl" />
            </div>
            <div className="text-sm text-slate-600 font-medium mb-2">Hospital</div>
            <div className="text-2xl font-bold text-blue-600">{stats.hospital}</div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full opacity-20"></div>
            <FaCalendarCheck />
            Calendar
          </h2>
          <Calendar
            onChange={setDate}
            value={date}
            className="w-full max-w-full border-none font-sans"
          />
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full opacity-20"></div>
            <FaCalendarCheck />
            Today's Appointments
          </h2>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <button className="px-6 py-2 rounded-full border border-slate-300 bg-white text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-all duration-300">
              All
            </button>
            <button className="px-6 py-2 rounded-full border border-slate-300 bg-white text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-all duration-300">
              Confirmed
            </button>
            <button className="px-6 py-2 rounded-full border border-slate-300 bg-white text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-all duration-300">
              Pending
            </button>
            <button className="px-6 py-2 rounded-full border border-slate-300 bg-white text-slate-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-all duration-300">
              Canceled
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600 border-b border-slate-200">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600 border-b border-slate-200">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600 border-b border-slate-200">Condition</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600 border-b border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm text-slate-700 border-b border-slate-100">{appt.time}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 border-b border-slate-100">{appt.patient}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 border-b border-slate-100">{appt.condition}</td>
                    <td className="px-4 py-3 border-b border-slate-100">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full opacity-20"></div>
            <FaBell />
            Notifications
          </h2>
          <ul className="space-y-3">
            {notifications.map((notification, index) => (
              <li key={index} className="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 rounded-lg transition-colors duration-200 flex items-center text-sm text-slate-600">
                <strong className="text-blue-600 font-semibold mr-2">{notification.message}</strong> 
                {notification.subject}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
