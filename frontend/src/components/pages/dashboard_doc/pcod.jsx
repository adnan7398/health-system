import React, { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setResult("");

    // Validation
    if (!features.age || !features.bmi || !features.cycleLength) {
      setError("Please fill in all fields.");
      return;
    }

    const predictionResult = getPrediction();
    setResult(predictionResult);
  };

  const getRiskColor = (risk) => {
    if (risk.includes("High")) return "text-red-600 bg-red-50 border-red-200";
    if (risk.includes("Medium")) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
            PCOD Risk Assessment
          </h2>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">About PCOD</h3>
            <p className="text-blue-700 text-sm">
              Polycystic Ovary Disease (PCOD) is a hormonal disorder affecting women of reproductive age. 
              This assessment tool helps evaluate risk factors based on key indicators.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Age</label>
              <input
                type="number"
                name="age"
                value={features.age}
                onChange={handleChange}
                placeholder="Enter your age"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Period Flow</label>
              <select
                name="periodFlow"
                value={features.periodFlow}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="light">Light</option>
                <option value="normal">Normal</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">BMI (Body Mass Index)</label>
              <input
                type="number"
                name="bmi"
                value={features.bmi}
                onChange={handleChange}
                placeholder="Enter your BMI"
                step="0.1"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Menstrual Cycle Length (in days)</label>
              <input
                type="number"
                name="cycleLength"
                value={features.cycleLength}
                onChange={handleChange}
                placeholder="Enter cycle length in days"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105"
            >
              Assess Risk
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">{error}</p>
            </div>
          )}
          
          {result && (
            <div className={`mt-8 p-6 rounded-xl border-2 ${getRiskColor(result)}`}>
              <h3 className="text-xl font-bold text-center mb-2">Assessment Result</h3>
              <p className="text-center text-lg">{result}</p>
            </div>
          )}

          {/* Information Section */}
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Understanding PCOD Risk Factors</h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Age:</strong> PCOD commonly develops in women aged 15-44</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>BMI:</strong> Higher BMI (25+) increases PCOD risk</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Cycle Length:</strong> Irregular cycles (35+ days) are a key indicator</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Period Flow:</strong> Heavy or irregular flow may indicate hormonal imbalance</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              <strong>Disclaimer:</strong> This is a preliminary assessment tool and should not replace professional medical diagnosis. 
              Please consult a healthcare provider for proper evaluation and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCODPredictor;
