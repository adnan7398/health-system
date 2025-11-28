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
        
        const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
        const response = await fetch(`${API_BASE}/details/${userId}`, {
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
    <div className="h-full bg-white shadow-lg border-r border-slate-200 p-6">
      <div className="max-w-sm mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <FaUserCircle className="text-white text-4xl" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors duration-200">
              <FaCamera className="text-blue-600 text-sm" />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {userData?.name || "Unknown User"}
          </h2>
          <p className="text-slate-600 font-medium mb-1">Patient ID: {userData?.id || "N/A"}</p>
          <p className="text-slate-500 text-sm">Member since {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : "N/A"}</p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 mb-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaPhone className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-800">{userData?.phone || "Not provided"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-green-600 text-sm" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-800">{userData?.email || "Not provided"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt className="text-purple-600 text-sm" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Location</p>
                <p className="font-medium text-slate-800">{userData?.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaHeartbeat className="text-emerald-600" />
            Health Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {userData?.age || "N/A"}
              </div>
              <div className="text-xs text-slate-600 font-medium">Age</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {userData?.bloodGroup || "N/A"}
              </div>
              <div className="text-xs text-slate-600 font-medium">Blood Group</div>
            </div>
          </div>
        </div>

        {/* Health Card QR Code */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaQrcode className="text-indigo-600" />
            Health Card QR Code
          </h3>
          
          <div className="text-center mb-4">
            <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
              {qrCodeData && (
                <QRCodeSVG
                  value={qrCodeData}
                  size={120}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                />
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleDownloadQR}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <FaDownload className="text-sm" />
              Download QR Code
            </button>
            
            <button
              onClick={handleShareQR}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <FaShare className="text-sm" />
              Share QR Code
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FaFileMedical className="text-orange-600" />
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {userData?.appointments?.length || 0}
              </div>
              <div className="text-xs text-slate-600 font-medium">Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {userData?.reports?.length || 0}
              </div>
              <div className="text-xs text-slate-600 font-medium">Reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
