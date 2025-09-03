import React, { useState, useEffect } from "react";
import { FaUser, FaQrcode, FaDownload, FaShare, FaEdit, FaCamera, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat, FaFileMedical, FaHome, FaCalendarCheck, FaRobot } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

const UserSidebar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Get user ID from token or localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }
        
        const response = await fetch(`http://localhost:3000/details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        
        // Generate QR code data
        const qrData = JSON.stringify({
          userId: data.id || "unknown",
          name: data.name || "Unknown User",
          type: "patient",
          timestamp: new Date().toISOString()
        });
        setQrCodeData(qrData);
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDownloadQR = () => {
    const svg = document.querySelector("svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 300;
        canvas.height = 300;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 0, 0, 300, 300);
        
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "health-card-qr.png";
        link.href = url;
        link.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        const canvas = document.querySelector("canvas");
        if (canvas) {
          canvas.toBlob(async (blob) => {
            const file = new File([blob], "health-card-qr.png", { type: "image/png" });
            await navigator.share({
              title: "My Health Card QR Code",
              text: "Here's my health card QR code",
              files: [file]
            });
          });
        }
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Sharing is not supported in this browser");
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-white shadow-lg border-r border-slate-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white shadow-lg border-r border-slate-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading profile</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-r border-slate-200 p-6">
      {/* User Profile Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <FaUser className="text-white text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Patient Portal</h2>
        <p className="text-slate-600 text-sm">Health Management System</p>
      </div>

      {/* QR Code Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Your Health Card</h3>
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          {qrCodeData && (
            <div className="flex flex-col items-center">
              <QRCodeSVG value={qrCodeData} size={120} className="mb-3" />
              <button
                onClick={handleDownloadQR}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Download QR
              </button>
            </div>
          )}
        </div>
        <p className="text-slate-600 text-xs text-center">
          Present this QR code at healthcare facilities for quick access to your medical records
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <a
          href="/userDashboard"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaHome className="text-white text-sm" />
          </div>
          Dashboard
        </a>

        <a
          href="/bookappointment"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaCalendarCheck className="text-white text-sm" />
          </div>
          Book Appointment
        </a>

        <a
          href="/patientappointments"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaCalendarAlt className="text-white text-sm" />
          </div>
          My Appointments
        </a>

        <a
          href="/medicalReport"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaFileMedical className="text-white text-sm" />
          </div>
          Medical Reports
        </a>

        <a
          href="/chatbot"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaRobot className="text-white text-sm" />
          </div>
          Health Assistant
        </a>

        <a
          href="/scanner"
          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <FaQrcode className="text-white text-sm" />
          </div>
          QR Scanner
        </a>
      </nav>

      {/* Health Status */}
      <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-slate-800">Health Status</span>
        </div>
        <p className="text-slate-600 text-xs">All systems operational</p>
      </div>
    </div>
  );
};

export default UserSidebar;
