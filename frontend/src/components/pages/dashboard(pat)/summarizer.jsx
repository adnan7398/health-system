import React, { useState } from "react";
import axios from "axios";
import "../css files patient/summarizer.css"; // Import CSS file
import Userdashboardsidebar from "./userdashboardsidebar";

const App = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setSummary(""); // Reset summary when a new file is selected
    setError(""); // Clear errors
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setSummary(""); // Clear previous summary

      const response = await axios.post(
        "http://localhost:8080/upload_pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSummary(response.data.summary || "No summary available.");
    } catch (err) {
      setError(
        err.response?.data?.error || "Error uploading file. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Left Sidebar */}
      <div className="left-sided">
        <Userdashboardsidebar />
      </div>
      <h2>AI Medical Report Summarizer</h2>

      {/* Main Content */}
      <div className="summarizer-content">
        {/* Left Image */}
        <div className="image-container">
          <img
            src="summarizerimg.png"
            alt="Medical Report"
            className="animated-image"
          />
        </div>

        {/* Right Form */}
        <div className="form-section">
          <p>Upload your reports and get Instant summary</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button className="btn" onClick={handleUpload} disabled={loading}>
            {loading ? "Summarizing..." : "Upload & Summarize"}
          </button>
        </div>
        {/* Display Errors or Summary */}
        {error && <p className="error">{error}</p>}
        {loading && <div className="loader"></div>}
        {summary && (
          <div className="summary-box">
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
