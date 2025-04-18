import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../css files patient/UserSidebar.css";
import { useNavigate } from "react-router-dom";

const UserSidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have authentication
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    // Check if we have userId
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    fetchUser();
  }, [userId, token]);

  const fetchUser = async () => {
    try {
      console.log("Fetching user data with ID:", userId);
      setLoading(true);
      
      const response = await fetch(`/api/register/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      console.log("User data response:", data);
      
      if (response.ok) {
        setUser(data);
        setError(null);
      } else {
        console.error("Error fetching user:", data.message);
        setError(data.message || "Failed to load user data");
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/signin");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUser();
  };

  return (
    <div className="sidebar open">
      {" "}
      {/* Sidebar is always open */}
      <div className="sidebar-content">
        <img src="arogyam card.png" alt="arogyam card" />
        <h2>User Details</h2>
        
        {loading ? (
          <p>Loading user details...</p>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={handleRefresh} className="refresh-button">
              Retry
            </button>
          </div>
        ) : user ? (
          <div>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>

            <p>
              <strong>Blood Group:</strong> {user.bloodGroup || "N/A"}
            </p>
            <p>
              <strong>Age:</strong> {user.age || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {user.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "N/A"}
            </p>
            <div className="qrcode-container">
              <h3>Your QR Code</h3>
              {userId && (
                <QRCodeCanvas value={userId} width={200} height={200} />
              )}
            </div>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
