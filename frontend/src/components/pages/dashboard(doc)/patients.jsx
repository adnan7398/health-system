import React, { useEffect, useState } from "react";
import "../css files doc/patients.css";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        console.log("Fetched Data:", data); // ✅ Debugging log

        if (Array.isArray(data)) {
          setPatients(data);
        } else if (Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      }
    };

    fetchPatients();
  }, [token]);

  return (
    <div className="patient-container">
      <h2>Patient List</h2>
      <div className="patient-list">
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <h3>
                {patient.firstName} {patient.lastName}
              </h3>
              <p>
                <strong>Age:</strong> {patient.age || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender || "N/A"}
              </p>
              <p>
                <strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}
              </p>
              <h4>Contact Details</h4>
              <p>
                <strong>Phone:</strong> {patient.contact?.phone || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {patient.contact?.email || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {patient.contact?.address || "N/A"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
