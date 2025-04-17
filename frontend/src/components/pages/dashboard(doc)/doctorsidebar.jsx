import React, { useEffect, useState } from "react";
import "../css files doc/doctorsidebar.css";

const DoctorSidebar = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const response = await fetch("http://localhost:3000/doctor/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDoctor(data.doctor);
        } else {
          console.error("Error fetching doctor:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, []);

  if (loading) {
    return <div className="sidebar">Loading...</div>;
  }

  return (
    <aside className="sidebar">
      {doctor ? (
        <>
          <div className="profile-pic-container"></div>
          <h2 className="doctor-name">
            <strong>
              Name: {doctor.firstName} {doctor.lastName}
            </strong>
          </h2>
          <p className="doctor-specialization">
            <strong>Specialization: {doctor.specialization}</strong>
          </p>
          <p className="doctor-hospital">
            <strong>Hospital: {doctor.hospital}</strong>
          </p>
          <p className="doctor-experience">
            <strong>Experience: {doctor.experience} years</strong>
          </p>
        </>
      ) : (
        <p className="error-message">Doctor details not found</p>
      )}
    </aside>
  );
};

export default DoctorSidebar;
