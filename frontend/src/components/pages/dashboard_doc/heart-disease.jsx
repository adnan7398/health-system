import React, { useState } from "react";

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

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High Risk":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium Risk":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low Risk":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
            Heart Disease Risk Predictor
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Blood Pressure (mmHg)</label>
              <input
                type="number"
                placeholder="Enter blood pressure (e.g., 120)"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Cholesterol Level (mg/dL)</label>
              <input
                type="number"
                placeholder="Enter cholesterol level"
                value={cholesterol}
                onChange={(e) => setCholesterol(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Do you have diabetes?</label>
              <select
                value={diabetes}
                onChange={(e) => setDiabetes(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105"
            >
              Predict Risk
            </button>
          </form>

          {prediction && (
            <div className={`mt-8 p-6 rounded-xl border-2 ${getRiskColor(prediction.split(': ')[1])}`}>
              <h3 className="text-xl font-bold text-center">{prediction}</h3>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">{error}</p>
            </div>
          )}

          {/* Information Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">About Heart Disease Risk Factors</h4>
            <div className="space-y-2 text-blue-700 text-sm">
              <p><strong>Age:</strong> Risk increases with age, especially after 45</p>
              <p><strong>Blood Pressure:</strong> High blood pressure (above 130/80) increases risk</p>
              <p><strong>Cholesterol:</strong> High cholesterol levels can lead to artery blockage</p>
              <p><strong>Diabetes:</strong> Diabetes significantly increases heart disease risk</p>
              <p><strong>Gender:</strong> Men generally have higher risk than women</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartRiskPredictor;
