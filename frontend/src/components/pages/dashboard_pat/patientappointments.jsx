import React, { useState, useEffect } from "react";
import "../css files patient/patientappointments.css"; // Ensure correct path
import Userdashboardsidebar from "./userdashboardsidebar";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId]); // Added userId as dependency

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:3000/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.appointments) {
        setAppointments(data.appointments);
      } else {
        console.error("Error fetching appointments:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Open modal and set selected appointment
  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="appointment-contain">
        {/* Left Sidebar - Navigation Links */}
        <div className="left-sided">
          <Userdashboardsidebar />
        </div>

        {/* Main Content */}
        <div className="Main-contant">
          <h2>My Appointments</h2>

          {/* Appointment Grid */}
          <div className="appointments-grid">
            {appointments.slice(0, 5).map((appointment) => (
              <div key={appointment._id} className="appointments-card">
                <p>
                  <strong>Doctor:</strong> {appointment.doctorId?.firstName}{" "}
                  {appointment.doctorId?.lastName}
                </p>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {appointment.doctorId?.specialization}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {appointment.date
                    ? new Date(appointment.date).toLocaleDateString("en-GB")
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status || "Pending"}
                </p>

                {/* Get Details Button */}
                <button
                  className="get-more-button"
                  onClick={() => handleOpenModal(appointment)}
                >
                  Get Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Appointment Details */}
      {isModalOpen && selectedAppointment && (
        <div className="full-screen-modal">
          <div className="modal-content">
            <button
              onClick={() => setIsModalOpen(false)}
              className="close-button"
            >
              Close
            </button>
            <h2>Appointment Details</h2>
            <p>
              <strong>Doctor:</strong> {selectedAppointment.doctorId?.firstName}{" "}
              {selectedAppointment.doctorId?.lastName}
            </p>
            <p>
              <strong>Specialization:</strong>{" "}
              {selectedAppointment.doctorId?.specialization}
            </p>
            <p>
              <strong>Patient:</strong> {selectedAppointment.userId?.firstName}{" "}
              {selectedAppointment.userId?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedAppointment.userId?.email}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedAppointment.date
                ? new Date(selectedAppointment.date).toLocaleDateString("en-GB")
                : "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status || "Pending"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientAppointments;
