import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css files patient/medicalReport.css";
import Userdashboardsidebar from "./userdashboardsidebar";

const MedicalReport = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [decryptPassword, setDecryptPassword] = useState("");
  const [showDecryptForm, setShowDecryptForm] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/files");
      setFiles(res.data.files || []);
    } catch (error) {
      toast.error("Failed to load files!");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !password)
      return toast.error("File and password are required!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      await axios.post("http://localhost:3000/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("File uploaded & encrypted successfully!");
      fetchFiles();
      setFile(null);
      setPassword("");
    } catch (error) {
      toast.error("Upload failed!");
    }
  };

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
    setDecryptPassword("");
    setShowDecryptForm(true);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !decryptPassword)
      return toast.error("Enter the password!");

    try {
      const res = await axios.post(
        "http://localhost:3000/files/download",
        { fileName: selectedFile, password: decryptPassword },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", selectedFile.replace(".enc", ".pdf"));
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("File decrypted & downloaded successfully!");
      setShowDecryptForm(false);
    } catch (error) {
      toast.error("Invalid password or file not found!");
    }
  };

  return (
    <div className="medical-report-container">
      {/* Left Sidebar - Navigation Links */}
      <div className="left-sided">
        <Userdashboardsidebar />
      </div>
      <div className="medical-report-content">
        {/*left side - image*/}
        <div className="image-container">
          <img
            src="securereport1.png"
            alt="Medical Report"
            className="animated-image"
          />
        </div>
        {/* right Side - Form Section */}
        <div className="form-section">
          <h2>📄Save & Secure your Medical Report</h2>

          <form className="upload-form" onSubmit={handleUpload}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input
              type="password"
              placeholder="Encryption password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Upload</button>
          </form>

          <h3>🔐 Encrypted Files</h3>
          {files.length === 0 ? (
            <p className="no-files">No files uploaded yet.</p>
          ) : (
            <ul className="file-list">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="file-item"
                  onClick={() => handleFileSelect(file)}
                >
                  {file}
                </li>
              ))}
            </ul>
          )}

          {showDecryptForm && (
            <form className="decrypt-form" onSubmit={handleDownload}>
              <input
                type="password"
                placeholder="Decryption password"
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
              />
              <button className="btn" type="submit">
                Decrypt & Download
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalReport;
