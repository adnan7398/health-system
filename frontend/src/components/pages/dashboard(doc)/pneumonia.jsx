import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [files, setFiles] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [specialization, setSpecialization] = useState("");
  const [appointments, setAppointments] = useState("");
  const [day, setDay] = useState("");

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Object.keys(files).forEach((key) => {
      formData.append(key, files[key]);
    });

    await axios.post("http://127.0.0.1:5000/upload", formData);
    alert("Files uploaded successfully");
  };

  const handlePredict = async () => {
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      specialization,
      daily_appointments: parseInt(appointments),
      day_of_week: parseInt(day),
    });
    setPrediction(response.data.predicted_doctors);
  };

  return (
    <div className="container">
      <h2>Hospital Trends & Predictions</h2>

      <h3>Upload CSV Files</h3>
      <input type="file" name="patients" onChange={handleFileChange} />
      <input type="file" name="doctors" onChange={handleFileChange} />
      <input type="file" name="appointments" onChange={handleFileChange} />
      <input type="file" name="procedures" onChange={handleFileChange} />
      <input type="file" name="billing" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h3>Predict Doctors Needed</h3>
      <input
        type="text"
        placeholder="Specialization"
        onChange={(e) => setSpecialization(e.target.value)}
      />
      <input
        type="number"
        placeholder="Daily Appointments"
        onChange={(e) => setAppointments(e.target.value)}
      />
      <select onChange={(e) => setDay(e.target.value)}>
        <option value="">Select Day</option>
        <option value="0">Monday</option>
        <option value="1">Tuesday</option>
        <option value="2">Wednesday</option>
        <option value="3">Thursday</option>
        <option value="4">Friday</option>
        <option value="5">Saturday</option>
        <option value="6">Sunday</option>
      </select>
      <button onClick={handlePredict}>Predict</button>

      {prediction !== null && <h4>Predicted Doctors Needed: {prediction}</h4>}
    </div>
  );
};

export default App;
