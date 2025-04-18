import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoctorSidebar from "./doctorsidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css files doc/DoctorDashboard.css";
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
    <div className="doctor-dashboard">
      <DoctorSidebar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1><FaUserMd /> Doctor Dashboard</h1>
          <button className="add-appointment-btn">
            <FaCalendarPlus /> Add Appointment
          </button>
        </header>
        
        {/* ML Tools Navigation */}
        <div className="ml-tools-nav">
          <Link to="/pneumonia" className="ml-tool-btn">
            <FaLungs /> Pneumonia Detection
          </Link>
          <Link to="/heartdisease" className="ml-tool-btn">
            <FaHeartbeat /> Heart Disease
          </Link>
          <Link to="/breastcancer" className="ml-tool-btn">
            <FaMicroscope /> Breast Cancer
          </Link>
          <Link to="/pcod" className="ml-tool-btn">
            <FaVenus /> PCOD
          </Link>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="icon"><FaUserInjured /></div>
            <div className="label">Total Patients</div>
            <div className="value">{stats.totalPatients}</div>
          </div>
          
          <div className="stat-card">
            <div className="icon"><FaCalendarCheck /></div>
            <div className="label">Today's Appointments</div>
            <div className="value">{stats.todaysAppointments}</div>
          </div>
          
          <div className="stat-card">
            <div className="icon"><FaCheckCircle /></div>
            <div className="label">Completed</div>
            <div className="value">{stats.completed}</div>
          </div>
          
          <div className="stat-card">
            <div className="icon"><FaHourglassHalf /></div>
            <div className="label">Pending</div>
            <div className="value">{stats.pending}</div>
          </div>
          
          <div className="stat-card">
            <div className="icon"><FaStethoscope /></div>
            <div className="label">Specialization</div>
            <div className="value">{stats.specialization}</div>
          </div>
        </div>
        
        <div className="stat-card" style={{marginBottom: "30px"}}>
          <div className="icon"><FaHospital /></div>
          <div className="label">Hospital</div>
          <div className="value">{stats.hospital}</div>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <h2><FaCalendarCheck /> Calendar</h2>
          <Calendar
            onChange={setDate}
            value={date}
            className="dashboard-calendar"
          />
        </div>

        {/* Appointments Section */}
        <div className="appointments-section">
          <h2><FaCalendarCheck /> Today's Appointments</h2>
          <div className="appointments-filter">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Confirmed</button>
            <button className="filter-btn">Pending</button>
            <button className="filter-btn">Canceled</button>
          </div>
          
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Condition</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr
                  key={index}
                  className={`status-${appt.status.toLowerCase()}`}
                >
                  <td>{appt.time}</td>
                  <td>{appt.patient}</td>
                  <td>{appt.condition}</td>
                  <td>
                    <span
                      className={`status status-${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Notifications Section */}
        <div className="notifications-section">
          <h2><FaBell /> Notifications</h2>
          <ul className="notifications-list">
            {notifications.map((notification, index) => (
              <li key={index}>
                <strong>{notification.message}</strong> {notification.subject}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
