import React, { useState, useRef } from "react";
import { FaUpload, FaFileAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaFlask, FaStethoscope, FaLightbulb, FaUserMd, FaImage, FaTimes } from "react-icons/fa";
import Userdashboardsidebar from "./userdashboardsidebar";

const LabReportAnalyzer = () => {
  const [reportText, setReportText] = useState("");
  const [gender, setGender] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setError(null);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Clear text input when image is selected
        setReportText("");
      } else {
        setError("Please select a valid image file");
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!reportText.trim() && !selectedImage) {
      setError("Please enter lab report text or upload an image");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setExtractedText("");

    try {
      let response;
      
      if (selectedImage) {
        // Upload image
        const formData = new FormData();
        formData.append('image', selectedImage);
        if (gender) {
          formData.append('gender', gender);
        }
        
        response = await fetch("http://127.0.0.1:5001/analyzelabreport", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send text
        response = await fetch("http://127.0.0.1:5001/analyzelabreport", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            report_text: reportText,
            gender: gender,
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        setAnalysis(data);
        // If text was extracted from image, show it
        if (data.extracted_text) {
          setExtractedText(data.extracted_text);
          setReportText(data.extracted_text);
        }
      } else {
        setError(data.error || "Failed to analyze report");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setReportText("Hemoglobin: 8.5 g/dL (Low)\nVitamin D: 15 ng/mL (Low)\nCalcium: 7.2 mg/dL (Low)");
  };

  return (
    <div className="dashboard-container">
      <div className="left-sided">
        <Userdashboardsidebar />
      </div>
      <div className="main-content" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaFlask className="text-4xl text-teal-600" />
            <h1 className="text-4xl font-bold text-gray-900">Lab Report Analyzer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your lab report and get simple Hinglish explanations with desi home remedy suggestions
          </p>
          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-amber-800">
              ⚠️ <strong>Important:</strong> This provides home remedy suggestions only. For medical diagnosis or treatment, always consult a doctor.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender (Optional - helps with accurate analysis)
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Lab Report Image (or enter text below)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Lab report preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md mb-4"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                  <p className="text-sm text-gray-600">Image selected: {selectedImage.name}</p>
                </div>
              ) : (
                <div>
                  <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <FaUpload />
                    Choose Image
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, PDF images</p>
                </div>
              )}
            </div>
          </div>

          {/* Text Input Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Lab Report Text Manually
            </label>
            <textarea
              value={reportText}
              onChange={(e) => {
                setReportText(e.target.value);
                // Clear image when text is entered
                if (e.target.value.trim() && selectedImage) {
                  handleRemoveImage();
                }
              }}
              placeholder="Paste your lab report here. Example format:&#10;Hemoglobin: 8.5 g/dL (Low)&#10;Vitamin D: 15 ng/mL (Low)&#10;Calcium: 7.2 mg/dL (Low)"
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            {extractedText && (
              <p className="text-xs text-teal-600 mt-2">
                ✓ Text extracted from image. You can edit it if needed.
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || (!reportText.trim() && !selectedImage)}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {selectedImage ? "Extracting & Analyzing..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <FaFileAlt />
                  {selectedImage ? "Extract & Analyze" : "Analyze Report"}
                </>
              )}
            </button>
            <button
              onClick={handleExample}
              disabled={!!selectedImage}
              className="px-6 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Example
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCheckCircle className="text-2xl text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Analysis Summary</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Tests</p>
                  <p className="text-2xl font-bold text-teal-600">{analysis.total_tests || 0}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Abnormal Findings</p>
                  <p className="text-2xl font-bold text-amber-600">{analysis.abnormal_findings || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analysis.abnormal_findings === 0 ? "All Normal" : "Needs Attention"}
                  </p>
                </div>
              </div>
            </div>

            {/* All Normal Message */}
            {analysis.message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-3xl text-green-600" />
                  <p className="text-lg text-green-800 font-semibold">{analysis.message}</p>
                </div>
              </div>
            )}

            {/* Findings */}
            {analysis.findings && analysis.findings.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaStethoscope className="text-teal-600" />
                  Problem Found:
                </h2>

                {analysis.findings.map((finding, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                  >
                    {/* Problem */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaExclamationTriangle className="text-red-500" />
                        <h3 className="text-xl font-bold text-gray-900">{finding.problem}</h3>
                      </div>
                    </div>

                    {/* Meaning */}
                    {finding.meaning && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-start gap-2">
                          <FaLightbulb className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-blue-900 mb-1">Meaning (Easy Hinglish):</p>
                            <p className="text-blue-800">{finding.meaning}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Remedies */}
                    {finding.remedies && finding.remedies.length > 0 && (
                      <div className="mb-4">
                        <p className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaFlask className="text-teal-600" />
                          Desi Remedies / Home Tips:
                        </p>
                        <ul className="space-y-2">
                          {finding.remedies.map((remedy, remedyIndex) => (
                            <li
                              key={remedyIndex}
                              className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border-l-4 border-teal-500"
                            >
                              <span className="text-teal-600 font-bold mt-1">•</span>
                              <span className="text-gray-800 flex-1">{remedy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Doctor Note */}
                    {finding.doctor_note && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                        <div className="flex items-start gap-2">
                          <FaUserMd className="text-amber-600 mt-1" />
                          <div>
                            <p className="font-semibold text-amber-900 mb-1">Doctor Note:</p>
                            <p className="text-amber-800">{finding.doctor_note}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Option 1:</strong> Upload a clear image of your lab report (JPG, PNG) - we'll extract all details automatically</li>
            <li><strong>Option 2:</strong> Copy your lab report text or type it manually</li>
            <li>Select your gender (optional, helps with accurate analysis)</li>
            <li>Click "Extract & Analyze" or "Analyze Report" to get instant analysis</li>
            <li>Review the findings and desi home remedy suggestions</li>
            <li>Always consult a doctor for medical diagnosis and treatment</li>
          </ol>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> For best OCR results, ensure the image is clear, well-lit, and the text is readable. 
              Avoid blurry or low-resolution images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportAnalyzer;

