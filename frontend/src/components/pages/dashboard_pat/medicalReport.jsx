import React, { useState, useEffect } from "react";
import { FaFileUpload, FaFileDownload, FaLock, FaUnlock, FaEye, FaTrash, FaShieldAlt, FaFileMedical, FaKey, FaUpload, FaDownload, FaEyeSlash, FaCheckCircle, FaExclamationTriangle, FaSearch, FaFilter, FaCalendarAlt, FaUserMd, FaHospital, FaFlask, FaHeartbeat, FaBrain, FaLungs, FaBone } from "react-icons/fa";

const MedicalReport = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [decryptPassword, setDecryptPassword] = useState("");
  const [showDecryptForm, setShowDecryptForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Mock data for demonstration - replace with actual API calls
  // API Base URL
  const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_BASE}/files`);
      const data = await response.json();
      if (data.files) {
        // Map backend file format to frontend expected format
        const mappedFiles = data.files.map((f, index) => ({
          id: f._id || index,
          name: f.originalName || f.storedName,
          encryptedName: f.storedName,
          uploadDate: f.createdAt || new Date().toISOString(),
          fileSize: f.size ? formatFileSize(f.size) : "N/A",
          type: f.mimeType === "application/pdf" ? "Medical Report" : "Document",
          category: "general", // Backend doesn't seem to store category yet, default to general
          status: "encrypted",
          doctor: "Unknown", // Backend doesn't store this yet
          hospital: "Arogyam Secure Storage",
          reportDate: f.createdAt || new Date().toISOString(),
          description: "Encrypted Medical Record"
        }));
        setFiles(mappedFiles);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const categories = [
    { value: "all", label: "All Reports", icon: FaFileMedical, color: "from-teal-500 to-teal-600" },
    { value: "laboratory", label: "Laboratory", icon: FaFlask, color: "from-teal-500 to-teal-600" },
    { value: "imaging", label: "Imaging", icon: FaHospital, color: "from-teal-500 to-teal-600" },
    { value: "cardiology", label: "Cardiology", icon: FaHeartbeat, color: "from-teal-500 to-teal-600" },
    { value: "neurology", label: "Neurology", icon: FaBrain, color: "from-teal-500 to-teal-600" },
    { value: "endocrinology", label: "Endocrinology", icon: FaUserMd, color: "from-teal-500 to-teal-600" }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : FaFileMedical;
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = (file.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
        alert('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !password) {
      alert('Please select a file and enter a password');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Fake progress for UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 200);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setFile(null);
        setPassword("");
        alert('File encrypted and uploaded successfully!');
        fetchFiles(); // Refresh list
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      clearInterval(progressInterval);
      alert('Upload failed. Network error.');
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setDecryptPassword("");
    setShowDecryptForm(true);
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    if (!selectedFile || !decryptPassword) {
      alert('Please enter the password');
      return;
    }

    setIsDecrypting(true);

    try {
      const response = await fetch(`${API_BASE}/files/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: selectedFile.encryptedName,
          password: decryptPassword
        })
      });

      if (!response.ok) {
        throw new Error("Decryption failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', selectedFile.name.replace(".enc", ""));
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowDecryptForm(false);
    } catch (error) {
      alert('Decryption failed. Please check your password.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      alert('File deleted successfully!');
    }
  };

  const formatFileSize = (size) => {
    const num = parseFloat(size);
    if (isNaN(num)) return size;
    if (num < 1) return (num * 1024).toFixed(1) + ' KB';
    return num.toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reports Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Medical Reports</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access, manage, and secure your medical documents with encryption
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by name, doctor, hospital, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${selectedCategory === category.value
                        ? "bg-teal-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <IconComponent className="text-sm" />
                      {category.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "grid" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "list" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Reports Display */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileMedical className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg mb-2">No reports found</p>
              <p className="text-gray-500">Try adjusting your search or category filters</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => {
                const CategoryIcon = getCategoryIcon(file.category);
                return (
                  <div key={file.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="text-xl text-teal-600" />
                      </div>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {file.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{file.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{file.description}</p>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaUserMd className="text-teal-500" />
                        <span>{file.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHospital className="text-teal-500" />
                        <span>{file.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-teal-500" />
                        <span>Report: {formatDate(file.reportDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-teal-500" />
                        <span>Uploaded: {formatDate(file.uploadDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaFileMedical className="text-teal-500" />
                        <span>{file.fileSize}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFileSelect(file)}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <FaUnlock />
                        Decrypt
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFiles.map((file) => {
                      const CategoryIcon = getCategoryIcon(file.category);
                      return (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="text-teal-500" />
                              <span className="text-sm text-gray-900">{file.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.doctor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.hospital}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(file.reportDate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.fileSize}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleFileSelect(file)}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                              >
                                Decrypt
                              </button>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload & Encrypt Medical Report</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Securely store your medical documents with end-to-end encryption
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Select Medical Report (PDF only, max 10MB)
                </label>
                <div className="border-2 border-dashed border-teal-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFileUpload className="text-3xl text-teal-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {file ? file.name : 'Click to select file'}
                    </p>
                    <p className="text-gray-600">
                      {file ? `Size: ${formatFileSize(file.size)}` : 'Drag and drop or click to browse'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Encryption Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password for encryption"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-12"
                    required
                    disabled={isUploading}
                  />
                  <FaKey className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  This password will be required to decrypt and access your file
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Encrypting and uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="submit"
                disabled={!file || !password || isUploading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Encrypting & Uploading...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Encrypt & Upload Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Decrypt Modal */}
      {showDecryptForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUnlock className="text-2xl text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Decrypt File</h3>
                <p className="text-gray-600">
                  Enter the password to decrypt and download: <strong>{selectedFile?.name}</strong>
                </p>
              </div>

              <form onSubmit={handleDecrypt} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decryption Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={decryptPassword}
                      onChange={(e) => setDecryptPassword(e.target.value)}
                      placeholder="Enter your encryption password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-12"
                      required
                      disabled={isDecrypting}
                    />
                    <FaKey className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!decryptPassword || isDecrypting}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDecrypting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Decrypting...
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        Decrypt & Download
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDecryptForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Security Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your medical records are protected with industry-leading security measures
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600 text-sm">Your files are encrypted before upload and remain encrypted in storage</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Military-Grade Security</h3>
              <p className="text-gray-600 text-sm">Advanced encryption algorithms ensure maximum protection</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaKey className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Protection</h3>
              <p className="text-gray-600 text-sm">Only you can access your files with your unique password</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Medical Records?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Start uploading and encrypting your medical reports today with bank-level security
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/userdashboard" className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg">
              Back to Dashboard
            </a>
            <button
              onClick={() => document.getElementById('file-upload').click()}
              className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Upload Report Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalReport;
