import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../css files doc/appointments.css";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/doctor/appointments",
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed Template Literal
        }
      );
      const data = await response.json();
      setAppointments(
        Array.isArray(data.appointments) ? data.appointments : []
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      const response = await fetch("http://localhost:3000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Fixed Template Literal
        },
        body: JSON.stringify({
          appointmentId,
          status: "accepted",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Appointment accepted. Auth Key: ${data.authKey}`); // ✅ Fixed Template Literal
        fetchAppointments();
      } else {
        console.error("Error updating appointment:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"; // Handle missing or null dates

    const appointmentDate = new Date(dateString);

    if (isNaN(appointmentDate.getTime())) {
      return "Invalid Date"; // Handle improperly formatted dates
    }

    return format(appointmentDate, "dd/MM/yyyy hh:mm a");
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
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
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="9">No appointments found.</td>
            </tr>
          ) : (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>
                  {appointment.userId.firstName} {appointment.userId.lastName}
                </td>
                <td>{appointment.userId.email}</td>
                <td>{appointment.userId.address}</td>
                <td>{appointment.userId.age}</td>
                <td>{appointment.userId.phoneNumber}</td>
                <td>{formatDate(appointment.date)}</td>
                <td className={`status ${appointment.status}`}>
                  {appointment.status}
                </td>
                {/* ✅ Fixed className syntax */}
                <td>{appointment.authKey || "N/A"}</td>
                <td>
                  {appointment.status !== "accepted" && (
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(appointment._id)}
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsPage;
