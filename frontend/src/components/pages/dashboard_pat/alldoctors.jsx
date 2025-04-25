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
        const response = await axios.get("http://localhost:3000/doctor");
        console.log("Fetched Doctors:", response.data); // Debugging
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
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
              <div key={doctor._id} className="doctor-card">
                <h3>
                  {" "}
                  <strong>Doctor Name: </strong>
                  {doctor.firstName} {doctor.lastName}
                </h3>
                <p>
                  <strong>Email: </strong> {doctor.email}
                </p>
                <p>
                  <strong>Hospital: </strong> {doctor.hospital}
                </p>
                <p>
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                <p>
                  <strong>Experience:</strong> {doctor.experience} years
                </p>
                <p>
                  <strong>Bio:</strong> {doctor.bio}
                </p>

                <button
                  onClick={() =>
                    navigate(`/bookappointment?doctorId=${doctor._id}`)
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
