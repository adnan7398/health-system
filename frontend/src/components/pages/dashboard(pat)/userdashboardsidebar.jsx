import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaUserMd,
  FaFileMedical,
  FaCalendarCheck,
  FaBookReader,
} from "react-icons/fa";
import "../css files patient/userdashboardsidebar.css";

const UserSidebarNav = () => {
  return (
    <div className="left-sidebar">
      <ul className="sidebar-links">
        <li>
          <Link to="/userdashboard">
            <FaHome className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/patientappointments">
            <FaCalendarAlt className="icon" /> Appointments
          </Link>
        </li>
        <li>
          <Link to="/bookappointment">
            <FaCalendarCheck className="icon" /> Book Appointment
          </Link>
        </li>
        <li>
          <Link to="/alldoctors">
            <FaUserMd className="icon" /> Doctors
          </Link>
        </li>
        <li>
          <Link to="/patientreport">
            <FaFileMedical className="icon" /> Medical Reports
          </Link>
        </li>
        <li>
          <Link to="/summarizer">
            <FaBookReader className="icon" />
            Summarizer
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebarNav;
