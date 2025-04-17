import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css files patient/bookappoinment.css";
import Userdashboardsidebar from "./userdashboardsidebar";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [authKey, setAuthKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctors");
        console.log("Doctors fetched:", response.data);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      setMessage("Please select a doctor.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Sending doctorId:", selectedDoctor);

      const response = await axios.post(
        "http://localhost:3000/book-appointment",
        { doctorId: selectedDoctor },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", response.data);
      setMessage(response.data.message);
      setAuthKey(response.data.appointment.authKey);
      setTimeout(() => navigate("/bookappointment"), 3000);
    } catch (error) {
      console.error("Error booking appointment:", error.response?.data);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="appointment-component">
      {/* Left Sidebar - Navigation Links */}
      <div className="left">
        <Userdashboardsidebar />
      </div>
      <div className="main-form ">
        <h2>Book an Appointment</h2>
        {message && <p className="message">{message}</p>}
        {authKey && (
          <p className="auth-key">
            Your Authentication Key: <strong>{authKey}</strong>
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <select
            value={selectedDoctor}
            onChange={(e) => {
              console.log("Selected Doctor ID:", e.target.value); // Debugging log
              setSelectedDoctor(e.target.value);
            }}
            required
          >
            <option value="">Select a Doctor</option>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))
            ) : (
              <option disabled>No available doctors</option>
            )}
          </select>

          <button type="submit">Confirm Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
