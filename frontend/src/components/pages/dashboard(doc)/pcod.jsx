import React, { useState } from "react";
import "../css files doc/pcod.css"; // Import the CSS file

const PCODPredictor = () => {
  const [features, setFeatures] = useState({
    age: "",
    periodFlow: "normal", // Default selected value
    bmi: "",
    cycleLength: "",
  });

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureArray = Object.values(features).map(Number); // Convert to numbers
    const getPrediction = () => {
      const ageNum = Number(features.age);
      const bmiNum = Number(features.bmi);
      const cycleLengthNum = Number(features.cycleLength);
      const periodFlow = features.periodFlow;

      if (bmiNum > 30 || cycleLengthNum > 35 || periodFlow === "heavy") {
        return "High Risk of PCOD";
      } else if (bmiNum > 25 || cycleLengthNum > 30 || periodFlow === "light") {
        return "Medium Risk of PCOD";
      } else {
        return "Low Risk of PCOD";
      }
    };

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      setError("");
      setResult("");

      // Validation
      if (!features.age || !features.bmi || !features.cycleLength) {
        setError("Please fill in all fields.");
        return;
      }

      const result = getPrediction();
      setResult(result);
    };

    return (
      <div className="container">
        <h2>PCOD Prediction</h2>
        <form onSubmit={handleSubmit}>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={features.age}
            onChange={handleChange}
            required
          />

          <label>Period Flow:</label>
          <select
            name="periodFlow"
            value={features.periodFlow}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="normal">Normal</option>
            <option value="heavy">Heavy</option>
          </select>

          <label>BMI:</label>
          <input
            type="number"
            name="bmi"
            value={features.bmi}
            onChange={handleChange}
            required
          />

          <label>Menstrual Cycle Length (in days):</label>
          <input
            type="number"
            name="cycleLength"
            value={features.cycleLength}
            onChange={handleChange}
            required
          />

          <button type="submit">Predict</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {result && <h3 className="prediction-result">Prediction: {result}</h3>}
      </div>
    );
  };
};
export default PCODPredictor;
