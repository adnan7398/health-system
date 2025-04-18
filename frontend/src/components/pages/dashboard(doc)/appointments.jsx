import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DoctorSidebar from "./doctorsidebar";
import "../css files doc/appointments.css";
import { FaCalendarCheck, FaCheck, FaEye, FaPlusCircle, FaSearch } from "react-icons/fa";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/doctor/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setAppointments(
        Array.isArray(data.appointments) ? data.appointments : []
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      const response = await fetch("http://localhost:3000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          status: "accepted",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Replace alert with more professional notification
        const authKey = data.authKey;
        // Show a toast or notification instead of an alert
        const notification = document.createElement("div");
        notification.className = "notification success";
        notification.textContent = `Appointment accepted. Auth Key: ${authKey}`;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
        fetchAppointments();
      } else {
        console.error("Error updating appointment:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";

    const appointmentDate = new Date(dateString);

    if (isNaN(appointmentDate.getTime())) {
      return "Invalid Date";
    }

    return format(appointmentDate, "dd/MM/yyyy hh:mm a");
  };
  
  const filteredAppointments = appointments.filter(appointment => {
    const fullName = `${appointment.userId.firstName} ${appointment.userId.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           appointment.userId.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="doctor-dashboard">
      <DoctorSidebar />
      <div className="dashboard-content">
        <div className="appointments-page">
          <div className="appointments-header">
            <h1><FaCalendarCheck /> Appointments</h1>
            <div className="appointments-actions">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by patient name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="add-appointment-btn">
                <FaPlusCircle /> New Appointment
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Auth Key</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-appointments">
                        <div className="empty-state">
                          <FaCalendarCheck className="empty-icon" />
                          <p>No appointments found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td className="patient-name">
                          {appointment.userId.firstName} {appointment.userId.lastName}
                        </td>
                        <td>{appointment.userId.email}</td>
                        <td>{appointment.userId.address || "N/A"}</td>
                        <td>{appointment.userId.age || "N/A"}</td>
                        <td>{appointment.userId.phoneNumber || "N/A"}</td>
                        <td>{formatDate(appointment.date)}</td>
                        <td>
                          <span className={`status ${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.authKey || "N/A"}</td>
                        <td className="actions-cell">
                          {appointment.status !== "accepted" ? (
                            <button
                              className="accept-button"
                              onClick={() => handleAccept(appointment._id)}
                              title="Accept Appointment"
                            >
                              <FaCheck /> Accept
                            </button>
                          ) : (
                            <button className="view-button" title="View Details">
                              <FaEye /> View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
