import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../css files patient/arogyamcard.css"; // Include the CSS file

const ArogyamCard = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`https://arogyam-15io.onrender.com/register/${userId}`, {
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
    <div className="card-container">
      <div className="left-section">
        <div className="info-box">
          <h1>Welcome to Arogyam</h1>
          <p>Your health, secured & accessible anytime.</p>

          <ul className="benefits-list">
            <li>
              ✔️ <strong>Secure Medical Storage</strong> – Save vital health
              info.
            </li>
            <li>
              ✔️ <strong>QR Code Access</strong> – Instant verification with a
              scan.
            </li>
            <li>
              ✔️ <strong>Emergency Support</strong> – Quick retrieval for urgent
              care.
            </li>
            <li>
              ✔️ <strong>Convenience</strong> – Access records anytime,
              paper-free.
            </li>
            <li>
              ✔️ <strong>Privacy First</strong> – Your data stays safe &
              confidential.
            </li>
          </ul>

          <p>Stay safe with Arogyam Health Card! 🌿💙</p>

          <img
            src="/arogyam card.png"
            alt="Arogyam Card"
            className="card-logo"
          />
        </div>
      </div>

      <div className="right-section">
        <div className="arogyam-card">
          <div className="card-head">
            <h2>Arogyam Health Card</h2>
          </div>

          {user ? (
            <div className="card-body">
              <div className="user-info">
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
              </div>

              <div className="qr-section">
                <h3>Scan to Verify</h3>
                {userId && <QRCodeCanvas value={userId} size={150} />}
              </div>
            </div>
          ) : (
            <p className="loading">Loading user details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArogyamCard;
