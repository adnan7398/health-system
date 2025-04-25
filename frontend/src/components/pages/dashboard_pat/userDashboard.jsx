import React, { useState, useEffect } from "react";
import "../css files patient/userdashboard.css";
import UserSidebar from "./usersidebar"; // Right sidebar (User Profile)
import Userdashboardsidebar from "./userdashboardsidebar";
import { 
  FaNotesMedical, 
  FaCalendarCheck, 
  FaUserMd, 
  FaHeartbeat, 
  FaFileMedical, 
  FaHistory,
  FaBell
} from "react-icons/fa";

const UserDashboard = () => {
  const [userName, setUserName] = useState("John Doe");
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiologist", date: "2023-10-15", time: "10:30 AM" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Neurologist", date: "2023-10-22", time: "2:00 PM" }
  ]);
  
  const [recentReports, setRecentReports] = useState([
    { id: 1, title: "Blood Test Results", date: "2023-09-30", status: "Completed" },
    { id: 2, title: "Chest X-Ray", date: "2023-09-15", status: "Completed" },
    { id: 3, title: "ECG Report", date: "2023-08-22", status: "Completed" }
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: "72 bpm",
    bloodPressure: "120/80 mmHg",
    weight: "68 kg",
    height: "175 cm",
    bmi: "22.2"
  });

  return (
    <div className="dashboard-container">
      {/* Left Sidebar - Navigation Links */}
      <div className="left-sidebar">
        <Userdashboardsidebar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-header">
          <h1><FaNotesMedical /> Patient Dashboard</h1>
          <p>Welcome back, <span className="user-highlight">{userName}</span></p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card health-metrics">
            <h2><FaHeartbeat /> Health Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Heart Rate</span>
                <span className="metric-value">{healthMetrics.heartRate}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Blood Pressure</span>
                <span className="metric-value">{healthMetrics.bloodPressure}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Weight</span>
                <span className="metric-value">{healthMetrics.weight}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Height</span>
                <span className="metric-value">{healthMetrics.height}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">BMI</span>
                <span className="metric-value">{healthMetrics.bmi}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card upcoming-appointments">
            <h2><FaCalendarCheck /> Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="appointments-list">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-doctor">
                      <FaUserMd />
                      <div>
                        <h3>{appointment.doctor}</h3>
                        <p>{appointment.specialty}</p>
                      </div>
                    </div>
                    <div className="appointment-time">
                      <div className="date">{new Date(appointment.date).toLocaleDateString()}</div>
                      <div className="time">{appointment.time}</div>
                    </div>
                  </div>
                ))}
                <button className="view-all-btn">View All Appointments</button>
              </div>
            ) : (
              <p className="no-data">No upcoming appointments</p>
            )}
          </div>
        </div>

        <div className="dashboard-card medical-reports">
          <h2><FaFileMedical /> Recent Medical Reports</h2>
          {recentReports.length > 0 ? (
            <div className="reports-list">
              <table>
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status status-${report.status.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="view-all-btn">View All Reports</button>
            </div>
          ) : (
            <p className="no-data">No medical reports available</p>
          )}
        </div>

        <div className="dashboard-card activity-history">
          <h2><FaHistory /> Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <FaBell className="activity-icon" />
              <div className="activity-details">
                <p>Appointment booked with Dr. Sarah Wilson</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <FaFileMedical className="activity-icon" />
              <div className="activity-details">
                <p>Blood Test Results uploaded</p>
                <span className="activity-time">5 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <FaUserMd className="activity-icon" />
              <div className="activity-details">
                <p>Consultation with Dr. Michael Chen completed</p>
                <span className="activity-time">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - User Profile */}
    </div>
  );
};

export default UserDashboard;
