import { useState } from "react";
import React from "react";
import "../css files doc/breastcancer.css"; // Import the CSS file

export default function BreastCancerPredictor() {
  const [features, setFeatures] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = parseFloat(value) || 0;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/breastpredict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="predictor-container">
      <h2 className="predictor-title">Breast Cancer Prediction</h2>
      <form onSubmit={handleSubmit} className="predictor-form">
        {[...Array(10)].map((_, i) => (
          <input
            key={i}
            type="number"
            placeholder={`Feature ${i + 1}`}
            className="feature-input"
            onChange={(e) => handleChange(i, e.target.value)}
          />
        ))}
        <button type="submit" className="predict-button">
          Predict
        </button>
      </form>
      {prediction !== null && (
        <p className="prediction-result">Prediction: {prediction}</p>
      )}
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}
