import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../css files patient/UserSidebar.css";

const UserSidebar = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/register/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error("Error fetching user:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="sidebar open">
      {" "}
      {/* Sidebar is always open */}
      <div className="sidebar-content">
        <img src="arogyam card.png" alt="arogyam card" />
        <h2>User Details</h2>
        {user ? (
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
                <QRCodeCanvas value={userId} width={400} height={400} />
              )}
            </div>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
