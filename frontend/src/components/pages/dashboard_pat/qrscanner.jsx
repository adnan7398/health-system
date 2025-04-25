import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "../css files patient/qrscanner.css";

const QRScanner = () => {
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scannerRef.current) return;

    const scannerId = "scanner";

    if (scannerContainerRef.current) {
      scannerContainerRef.current.innerHTML = "";
    }

    const qrCodeScanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: 250 },
      false
    );

    qrCodeScanner.render((decodedText) => {
      handleDecodedData(decodedText);
    });

    scannerRef.current = qrCodeScanner;

    return () => {
      qrCodeScanner
        .clear()
        .catch((error) => console.log("Scanner cleanup error:", error));
      scannerRef.current = null;
    };
  }, []);

  const handleDecodedData = (decodedText) => {
    console.log("QR Code Detected!", decodedText);
    navigate("/auth");
  };

  return (
    <div className="scanner-wrapper">
      {/* Left Side - Image */}
      <div className="scanner-image">
        <img src="qrimg.png" alt="QR Code Illustration" />
      </div>

      {/* Right Side - Scanner */}
      <div className="scanner-content">
        <a href="/arogyamcard" className="qr-code-link">
          Your QRCode
        </a>

        <h2>QR Code Scanner</h2>
        <div id="scanner" ref={scannerContainerRef} className="scanner"></div>
      </div>
    </div>
  );
};

export default QRScanner;
