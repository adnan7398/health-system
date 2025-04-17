import React, { useState } from "react";
import DoctorSidebar from "./doctorsidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css files doc/DoctorDashboard.css";

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

const DoctorDashboard = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="doctor-dashboard">
      <DoctorSidebar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>👨‍⚕ Doctor's Dashboard</h1>
          <button className="add-appointment-btn">➕ Add Appointment</button>
        </header>

        <section className="stats-section">
          <div className="stat-card">
            👥 Total Patients: <strong>6</strong>
          </div>
          <div className="stat-card">
            📅 Appointments Today: <strong>4</strong>
          </div>
          <div className="stat-card">
            ✅ Completed: <strong>2</strong>
          </div>
          <div className="stat-card">
            🔄 Pending: <strong>1</strong>
          </div>
          <div className="stat-card">
            ⚕ Specialization: <strong>Neurologist</strong>
          </div>
          <div className="stat-card">
            🏥 Hospital: <strong>City Medical Center</strong>
          </div>
        </section>

        <section className="calendar-section">
          <h2>📅 Calendar</h2>
          <Calendar onChange={setDate} value={date} />
        </section>

        <section className="appointments-section">
          <h2>📆 Today's Appointments</h2>
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
        </section>

        <section className="notifications-section">
          <h2>🔔 Notifications</h2>
          <ul className="notifications-list">
            <li>
              📢 New patient registered: <strong>Daniel Green</strong>
            </li>
            <li>
              🔄 Appointment rescheduled: <strong>Sarah Williams</strong>
            </li>
            <li>
              ✅ Appointment completed: <strong>Michael Johnson</strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
