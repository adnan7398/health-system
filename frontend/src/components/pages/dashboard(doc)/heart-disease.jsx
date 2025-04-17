import React, { useState } from "react";
import "../css files doc/heart-disease.css"; // Import the CSS file

const HeartRiskPredictor = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [diabetes, setDiabetes] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  // Function to determine prediction based on symptoms
  const getPrediction = () => {
    const ageNum = Number(age);
    const bpNum = Number(bloodPressure);
    const cholesterolNum = Number(cholesterol);
    const hasDiabetes = diabetes.toLowerCase() === "yes";

    if (ageNum > 55 || bpNum > 135 || cholesterolNum > 90 || hasDiabetes) {
      return "High Risk";
    } else if (ageNum > 45 || bpNum > 125) {
      return "Medium Risk";
    } else {
      return "Low Risk";
    }
  };

  const handleSubmit = () => {
    setError("");
    setPrediction(null);

    if (!age || isNaN(age) || age <= 0) {
      setError("Please enter a valid age.");
      return;
    }
    if (!["male", "female"].includes(gender.toLowerCase())) {
      setError("Please enter Male or Female for gender.");
      return;
    }
    if (!bloodPressure || isNaN(bloodPressure) || bloodPressure <= 0) {
      setError("Please enter a valid blood pressure value.");
      return;
    }
    if (!cholesterol || isNaN(cholesterol) || cholesterol <= 0) {
      setError("Please enter a valid cholesterol level.");
      return;
    }
    if (!["yes", "no"].includes(diabetes.toLowerCase())) {
      setError("Please enter Yes or No for diabetes.");
      return;
    }

    const result = getPrediction();
    setPrediction(`${name}, your predicted heart disease risk is: ${result}`);
  };

  return (
    <div className="predictor-container">
      <h2>Heart Disease Risk Predictor</h2>

      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="predictor-input"
      />

      <input
        type="text"
        placeholder="Enter your gender (Male/Female)"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="predictor-input"
      />

      <input
        type="number"
        placeholder="Enter blood pressure (e.g., 120)"
        value={bloodPressure}
        onChange={(e) => setBloodPressure(e.target.value)}
        className="predictor-input"
      />

      <input
        type="number"
        placeholder="Enter cholesterol level"
        value={cholesterol}
        onChange={(e) => setCholesterol(e.target.value)}
        className="predictor-input"
      />

      <input
        type="text"
        placeholder="Do you have diabetes? (Yes/No)"
        value={diabetes}
        onChange={(e) => setDiabetes(e.target.value)}
        className="predictor-input"
      />

      <button onClick={handleSubmit} className="predictor-button">
        Predict
      </button>

      {prediction && <h3 className="prediction-result">{prediction}</h3>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HeartRiskPredictor;
