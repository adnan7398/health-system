import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css files patient/alldoctors.css"; // Import CSS for styling
import Userdashboardsidebar from "./userdashboardsidebar";
const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
        // Use /doctors endpoint which returns all doctor fields
        const response = await axios.get(`${API_BASE}/doctors`);
        console.log("Fetched Doctors:", response.data); // Debugging
        if (Array.isArray(response.data)) {
          setDoctors(response.data);
        } else if (response.data.doctors && Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="doctors-container">
      {/* Left Sidebar - Navigation Links */}
      <div className="left-sider">
        <Userdashboardsidebar />
      </div>
      <div className="Main-content">
        <h2>Available Doctors</h2>
        <div className="doctors-grid">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor._id || doctor.id} className="doctor-card">
                {doctor.profileImage && (
                  <div className="doctor-image-container">
                    <img 
                      src={doctor.profileImage} 
                      alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      className="doctor-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <h3>
                  <strong>Dr. {doctor.firstName} {doctor.lastName}</strong>
                </h3>
                {doctor.specialization && (
                  <p className="specialization">
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                )}
                {doctor.hospital && (
                  <p>
                    <strong>Hospital: </strong> {doctor.hospital}
                  </p>
                )}
                {doctor.experience && (
                  <p>
                    <strong>Experience:</strong> {doctor.experience} years
                  </p>
                )}
                {doctor.bio && (
                  <p className="bio">
                    <strong>Bio:</strong> {doctor.bio}
                  </p>
                )}
                {doctor.email && (
                  <p className="email">
                    <strong>Email: </strong> {doctor.email}
                  </p>
                )}

                <button
                  onClick={() =>
                    navigate(`/bookappointment?doctorId=${doctor._id || doctor.id}`)
                  }
                  className="doctor-btn"
                >
                  Book Appointment
                </button>
              </div>
            ))
          ) : (
            <p>No doctors available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
