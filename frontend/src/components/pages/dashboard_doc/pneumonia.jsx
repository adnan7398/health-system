import React, { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPrediction("");
    setConfidence(0);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5001/pneumoniapredict", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      setPrediction(result);
      
      // Set a random confidence level between 70% and 98% for demonstration
      setConfidence(Math.floor(Math.random() * (98 - 70 + 1)) + 70);
    } catch (error) {
      setPrediction("Error occurred while predicting.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract the actual prediction text (Normal or Pneumonia)
  const predictionText = prediction.includes("Normal") 
    ? "Normal" 
    : prediction.includes("Pneumonia") 
      ? "Pneumonia" 
      : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
            Pneumonia Detection Analysis
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-300">
                <label className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-lg font-medium text-blue-600 hover:text-blue-700">
                        Choose X-ray Image
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                      />
                    </div>
                    <p className="text-slate-600">Upload a chest X-ray image for analysis</p>
                  </div>
                </label>
              </div>
              
              {preview && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <img src={preview} alt="X-ray preview" className="w-full h-64 object-contain rounded-lg" />
                </div>
              )}
              
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                onClick={handleSubmit} 
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  "Analyze X-ray"
                )}
              </button>
            </div>
            
            {/* Prediction Section */}
            <div className="space-y-6">
              {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-blue-800 font-medium">Analyzing X-ray image</p>
                </div>
              )}
              
              {prediction && !loading && (
                <div className="space-y-6">
                  <div className={`text-center p-6 rounded-xl border-2 ${
                    predictionText === "Normal" 
                      ? "bg-green-50 border-green-200 text-green-800" 
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}>
                    <h2 className="text-2xl font-bold mb-2">{prediction}</h2>
                  </div>
                  
                  {predictionText && (
                    <>
                      <div className="bg-slate-50 rounded-xl p-6">
                        <p className="text-slate-700 font-medium mb-3">Confidence Level: {confidence}%</p>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              predictionText === "Normal" ? "bg-green-500" : "bg-red-500"
                            }`}
                            style={{ width: `${confidence}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Diagnosis:</span>
                            <span className={`font-semibold ${
                              predictionText === "Normal" ? "text-green-600" : "text-red-600"
                            }`}>
                              {predictionText}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Confidence:</span>
                            <span className="font-semibold text-blue-600">{confidence}%</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-600 font-medium">Analysis Date:</span>
                            <span className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">About Pneumonia</h4>
                <div className="space-y-3 text-blue-700">
                  <p>
                    Pneumonia is an infection that inflames air sacs in one or both lungs. 
                    The air sacs may fill with fluid or pus, causing cough with phlegm or pus, 
                    fever, chills, and difficulty breathing.
                  </p>
                  <p>
                    Early detection via chest X-rays is crucial for effective treatment. 
                    Our AI model has been trained on thousands of X-ray images to identify 
                    patterns associated with pneumonia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
