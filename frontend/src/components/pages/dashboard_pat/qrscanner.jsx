import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { FaQrcode, FaHeartbeat, FaUserMd, FaCalendarCheck, FaFileMedical, FaRobot, FaQrcode as FaQrCodeIcon, FaCheckCircle, FaArrowRight, FaShieldAlt, FaUser, FaHospital, FaFlask, FaAmbulance, FaBrain, FaRunning, FaLeaf, FaCamera, FaTimes } from "react-icons/fa";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState("ready"); // ready, scanning, success, error
  const [userProfile, setUserProfile] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Fetch user profile
    fetchUserProfile();

    // Cleanup function
    return () => {
      cleanupScanner();
    };
  }, [navigate]);

  const cleanupScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      scannerRef.current = null;
    } catch (error) {
      console.log("Scanner cleanup error:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(`https://arogyam-15io.onrender.com/register/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const getAvailableCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);
      if (devices.length > 0) {
        setSelectedCamera(devices[0].id);
      }
    } catch (error) {
      console.error("Error getting cameras:", error);
      setScannerError("Unable to access camera. Please check permissions.");
    }
  };

  const startScanner = async () => {
    try {
      // Clean up any existing scanner first
      await cleanupScanner();

      // Get available cameras
      await getAvailableCameras();

      if (cameras.length === 0) {
        setScannerError("No cameras available. Please check camera permissions.");
        return;
      }

      setIsScanning(true);
      setScanStatus("scanning");
      setScannerError(null);

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check if component is still mounted
      if (!scannerContainerRef.current) return;

      // Create new scanner instance
      const html5QrCode = new Html5Qrcode("scanner");
      scannerRef.current = html5QrCode;

      // Start scanning
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleDecodedData(decodedText);
        },
        (error) => {
          // Handle scanning errors silently
          console.log("Scanning error:", error);
        }
      );

    } catch (error) {
      console.error("Error starting scanner:", error);
      setScannerError("Failed to start scanner. Please try again.");
      setIsScanning(false);
      setScanStatus("error");
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      scannerRef.current = null;
      
      setIsScanning(false);
      setScanStatus("ready");
      setScannerError(null);
    } catch (error) {
      console.error("Error stopping scanner:", error);
      // Force reset state even if cleanup fails
      setIsScanning(false);
      setScanStatus("ready");
      setScannerError(null);
    }
  };

  const handleDecodedData = (decodedText) => {
    console.log("QR Code Detected!", decodedText);
    
    // Stop the scanner immediately
    stopScanner();
    
    // Set success status
    setScanStatus("success");
    setScanResult(decodedText);
    
    // Show features after successful scan
    setTimeout(() => {
      setShowFeatures(true);
    }, 1500);
  };

  const handleFeatureClick = (feature) => {
    switch (feature) {
      case "dashboard":
        navigate("/userdashboard");
        break;
      case "appointments":
        navigate("/bookappointment");
        break;
      case "reports":
        navigate("/patientreport");
        break;
      case "chatbot":
        navigate("/chatbot");
        break;
      case "healthcard":
        navigate("/arogyamcard");
        break;
      case "fitness":
        navigate("/fitness");
        break;
      default:
        navigate("/userdashboard");
    }
  };

  const resetScanner = async () => {
    try {
      setShowFeatures(false);
      setScanStatus("ready");
      setScanResult(null);
      setScannerError(null);
      await cleanupScanner();
    } catch (error) {
      console.error("Error resetting scanner:", error);
    }
  };

  const features = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View your health overview and recent activities",
      icon: FaHeartbeat,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "appointments",
      title: "Book Appointments",
      description: "Schedule consultations with healthcare professionals",
      icon: FaCalendarCheck,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "reports",
      title: "Medical Reports",
      description: "Access your encrypted medical documents",
      icon: FaFileMedical,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "chatbot",
      title: "AI Health Assistant",
      description: "Get instant health guidance and advice",
      icon: FaRobot,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "healthcard",
      title: "Health Card",
      description: "Your digital health identity and QR code",
      icon: FaQrCodeIcon,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "fitness",
      title: "Fitness & Wellness",
      description: "Join fitness events and wellness programs",
      icon: FaRunning,
      color: "from-teal-500 to-teal-600"
    }
  ];

  if (showFeatures) {
    return (
      <div className="min-h-screen bg-white">
        {/* User Profile Section */}
        {userProfile && (
          <section className="py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-2xl text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome back, {userProfile.firstName} {userProfile.lastName}!
                    </h2>
                    <p className="text-gray-600">
                      Your health profile is ready. Choose from the features below to get started.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Health Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Access all your healthcare services and tools
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                  <div className="flex items-center justify-center">
                    <FaArrowRight className="text-teal-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-teal-700 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Manage Your Health?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Start exploring your health features and take control of your wellness journey
            </p>
            <button
              onClick={resetScanner}
              className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
            >
              Scan Another QR Code
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Scanner Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Scan Your Health Card</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Position your QR code within the scanner to verify your identity and access your health features
              </p>
            </div>

            {/* Scanner Status */}
            <div className="text-center mb-6">
              {scanStatus === "ready" && (
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaQrcode className="text-2xl text-teal-600" />
                </div>
              )}
              {scanStatus === "scanning" && (
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              )}
              {scanStatus === "success" && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
              )}
              {scanStatus === "error" && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="text-2xl text-red-600" />
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {scanStatus === "ready" && "Ready to Scan"}
                {scanStatus === "scanning" && "Scanning..."}
                {scanStatus === "success" && "QR Code Verified!"}
                {scanStatus === "error" && "Scanner Error"}
              </h3>
              <p className="text-gray-600">
                {scanStatus === "ready" && "Click the button below to start scanning"}
                {scanStatus === "scanning" && "Position your QR code within the scanner"}
                {scanStatus === "success" && "Redirecting to your health features..."}
                {scanStatus === "error" && scannerError || "An error occurred. Please try again."}
              </p>
            </div>

            {/* Scanner Controls */}
            <div className="text-center mb-6">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  disabled={scanStatus === "success"}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto disabled:cursor-not-allowed"
                >
                  <FaCamera />
                  Start Scanner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto"
                >
                  <FaTimes />
                  Stop Scanner
                </button>
              )}
            </div>

            {/* Scanner Container */}
            <div 
              id="scanner" 
              ref={scannerContainerRef} 
              className="scanner-container min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            >
              {!isScanning && scanStatus === "ready" && (
                <div className="text-center text-gray-500">
                  <FaQrcode className="text-4xl mx-auto mb-2" />
                  <p>Scanner will appear here when started</p>
                </div>
              )}
              {scanStatus === "scanning" && (
                <div className="text-center text-teal-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                  <p>Initializing camera...</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-2">How to use:</h4>
              <ol className="text-sm text-teal-700 space-y-1">
                <li>1. Click "Start Scanner" to activate your camera</li>
                <li>2. Position your Arogyam health card QR code within the scanner frame</li>
                <li>3. Hold steady until the code is detected</li>
                <li>4. You'll be automatically redirected to your health features</li>
              </ol>
            </div>

            {/* Error Display */}
            {scannerError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{scannerError}</p>
                <button
                  onClick={() => setScannerError(null)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Alternative Access */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Alternative Access</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            If you don't have a QR code or prefer direct access, you can use these options
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/arogyamcard"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg flex items-center gap-2 justify-center"
            >
              <FaQrCodeIcon />
              Get Your Health Card
            </a>
            <a
              href="/userdashboard"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QRScanner;
