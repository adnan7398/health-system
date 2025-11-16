import { useState } from "react";
import React from "react";

export default function BreastCancerPredictor() {
  const [features, setFeatures] = useState(new Array(10).fill(0));
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = parseFloat(value) || 0;
    setFeatures(newFeatures);
  };

  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Validate that all features are filled
    if (features.length !== 10 || features.some(f => f === undefined || f === null || f === 0 || isNaN(f))) {
      setError("Please fill in all 10 features with valid numbers");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/breastpredict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      
      if (!response.ok) {
        throw new Error("Prediction failed");
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPrediction(data.prediction);
      setConfidence(data.confidence || 75);
    } catch (err) {
      setError(err.message || "Error occurred while predicting");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6 relative overflow-hidden">
      {/* AI/ML Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-8">
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
                disabled={loading}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 px-8 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  "Analyze & Predict"
                )}
              </button>
            </div>
          </form>

          {prediction !== null && (
            <div className="mt-8 space-y-4">
              <div className={`p-6 rounded-xl border-2 ${
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
              {confidence > 0 && (
                <div className="bg-slate-50 rounded-xl p-6">
                  <p className="text-slate-700 font-medium mb-3">Confidence Level: {confidence}%</p>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        prediction === 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>
                </div>
              )}
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
