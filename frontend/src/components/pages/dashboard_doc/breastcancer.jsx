import { useState } from "react";
import React from "react";

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

  const featureNames = [
    "Mean Radius",
    "Mean Texture", 
    "Mean Perimeter",
    "Mean Area",
    "Mean Smoothness",
    "Mean Compactness",
    "Mean Concavity",
    "Mean Concave Points",
    "Mean Symmetry",
    "Mean Fractal Dimension"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
            Breast Cancer Prediction
          </h2>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">About the Model</h3>
            <p className="text-blue-700 text-sm">
              This AI model analyzes 10 key features from breast mass characteristics to predict 
              whether a mass is benign or malignant. Please provide accurate measurements for the best results.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {featureNames[i]}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`Enter ${featureNames[i].toLowerCase()}`}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    onChange={(e) => handleChange(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3 px-8 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105"
              >
                Analyze & Predict
              </button>
            </div>
          </form>

          {prediction !== null && (
            <div className={`mt-8 p-6 rounded-xl border-2 ${
              prediction === 0 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <h3 className="text-xl font-bold text-center mb-2">
                Prediction Result
              </h3>
              <p className="text-center text-lg">
                {prediction === 0 ? "Benign (Non-cancerous)" : "Malignant (Cancerous)"}
              </p>
              <p className="text-center text-sm mt-2 opacity-80">
                {prediction === 0 
                  ? "The mass appears to be non-cancerous based on the analysis." 
                  : "The mass shows characteristics associated with cancer. Please consult a healthcare professional immediately."
                }
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">Error: {error}</p>
            </div>
          )}

          {/* Information Section */}
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Understanding the Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <p><strong>Mean Radius:</strong> Average size of the core tumor</p>
                <p><strong>Mean Texture:</strong> Standard deviation of gray-scale values</p>
                <p><strong>Mean Perimeter:</strong> Average perimeter of the tumor</p>
                <p><strong>Mean Area:</strong> Average area of the tumor</p>
                <p><strong>Mean Smoothness:</strong> Local variation in radius lengths</p>
              </div>
              <div>
                <p><strong>Mean Compactness:</strong> Perimeter² / area - 1.0</p>
                <p><strong>Mean Concavity:</strong> Severity of concave portions</p>
                <p><strong>Mean Concave Points:</strong> Number of concave portions</p>
                <p><strong>Mean Symmetry:</strong> Symmetry of the tumor</p>
                <p><strong>Mean Fractal Dimension:</strong> Coastline approximation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
