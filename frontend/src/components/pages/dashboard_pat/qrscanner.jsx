import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  // Add CSS for Html5Qrcode library
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      #scanner {
        position: relative !important;
        min-height: 400px !important;
        width: 100% !important;
        max-width: 400px !important;
      }
      #scanner video {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 8px !important;
      }
      #scanner canvas {
        width: 100% !important;
        height: 100% !important;
        border-radius: 8px !important;
      }
      .html5-qrcode-element {
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Check camera permissions on mount
    checkInitialCameraStatus();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      cleanupScanner();
    };
  }, [navigate]);

  const checkInitialCameraStatus = async () => {
    try {
      // Check if we can access camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      // If successful, get available cameras
      await getAvailableCameras();
    } catch (error) {
      console.log("Initial camera check failed:", error);
      // Don't show error on initial load, just set cameras to empty
      setCameras([]);
    }
  };

  const cleanupScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        // Check if the scanner is actually scanning before trying to stop
        try {
          if (scannerRef.current.isScanning && scannerRef.current.isScanning()) {
            await scannerRef.current.stop();
            console.log("Scanner stopped successfully");
          }
        } catch (stopError) {
          console.log("Error stopping scanner:", stopError);
        }
        
        // Clear the scanner element content safely
        try {
          const scannerElement = document.getElementById('scanner');
          if (scannerElement && scannerElement.parentNode) {
            // Create a new clean scanner element
            const newScannerElement = document.createElement('div');
            newScannerElement.id = 'scanner';
            newScannerElement.className = 'scanner-container min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50';
            
            if (scannerElement.parentNode) {
              scannerElement.parentNode.replaceChild(newScannerElement, scannerElement);
            }
          }
        } catch (domError) {
          console.log("Error cleaning up scanner DOM:", domError);
        }
        
        scannerRef.current = null;
      }
    } catch (error) {
      console.log("Scanner cleanup error:", error);
      // Force cleanup even if there's an error
      scannerRef.current = null;
    }
  }, []);

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
      // First check if we have camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      // Now get available cameras
      const devices = await Html5Qrcode.getCameras();
      if (isMountedRef.current) {
        setCameras(devices);
        if (devices.length > 0) {
          setSelectedCamera(devices[0].id);
        }
      }
    } catch (error) {
      console.error("Error getting cameras:", error);
      if (isMountedRef.current) {
        if (error.name === 'NotAllowedError') {
          setScannerError("Camera permission denied. Please allow camera access and try again.");
        } else if (error.name === 'NotFoundError') {
          setScannerError("No camera found on this device.");
        } else if (error.name === 'NotReadableError') {
          setScannerError("Camera is already in use by another application.");
        } else {
          setScannerError("Unable to access camera. Please check permissions and try again.");
        }
      }
    }
  };

  const requestCameraPermission = async () => {
    try {
      setScannerError(null);
      setScanStatus("scanning");
      
      // Request camera permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      // Now try to get cameras again
      await getAvailableCameras();
      
      if (cameras.length > 0) {
        // Start scanner with the granted permission
        await startScannerWithPermission();
      }
    } catch (error) {
      console.error("Camera permission request failed:", error);
      if (isMountedRef.current) {
        if (error.name === 'NotAllowedError') {
          setScannerError("Camera access denied. Please allow camera permissions in your browser settings and refresh the page.");
        } else if (error.name === 'NotSupportedError') {
          setScannerError("Camera not supported on this device or browser.");
        } else {
          setScannerError("Failed to request camera permission. Please check your browser settings.");
        }
        setScanStatus("error");
      }
    }
  };

  const startScannerWithPermission = async () => {
    try {
      // Clean up any existing scanner first
      await cleanupScanner();

      // Check if component is still mounted
      if (!isMountedRef.current || !scannerContainerRef.current) return;

      setIsScanning(true);
      setScanStatus("scanning");
      setScannerError(null);

      // Ensure the scanner container is clean and exists
      const scannerElement = document.getElementById('scanner');
      if (!scannerElement) {
        console.error("Scanner element not found");
        setScannerError("Scanner initialization failed. Please refresh the page.");
        setIsScanning(false);
        setScanStatus("error");
        return;
      }

      // Clear any existing content safely
      try {
        scannerElement.innerHTML = '';
      } catch (error) {
        console.log("Error clearing scanner element:", error);
      }

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check again if component is still mounted
      if (!isMountedRef.current || !scannerContainerRef.current) return;

      // Verify scanner element still exists
      const newScannerElement = document.getElementById('scanner');
      if (!newScannerElement) {
        console.error("Scanner element was removed");
        setScannerError("Scanner initialization failed. Please refresh the page.");
        setIsScanning(false);
        setScanStatus("error");
        return;
      }

      console.log("Starting Html5Qrcode scanner...");

      // Create new scanner instance with the fresh element
      const html5QrCode = new Html5Qrcode("scanner");
      scannerRef.current = html5QrCode;

      console.log("Html5Qrcode instance created, starting scanner...");

      // Start scanning with simpler configuration
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          console.log("QR Code detected:", decodedText);
          if (isMountedRef.current) {
            handleDecodedData(decodedText);
          }
        },
        (error) => {
          // Handle scanning errors silently
          console.log("Scanning error:", error);
        }
      );

      console.log("Scanner started successfully");
      
      // If we reach here, scanner started successfully
      setScanStatus("scanning");
      setScannerError(null);

    } catch (error) {
      console.error("Error starting scanner:", error);
      if (isMountedRef.current) {
        if (error.name === 'NotAllowedError') {
          setScannerError("Camera permission denied. Please allow camera access and try again.");
        } else if (error.name === 'NotFoundError') {
          setScannerError("No camera found on this device.");
        } else if (error.name === 'NotReadableError') {
          setScannerError("Camera is already in use by another application.");
        } else {
          setScannerError("Failed to start scanner: " + error.message);
        }
        setIsScanning(false);
        setScanStatus("error");
      }
    }
  };

  const startScanner = async () => {
    try {
      // Check if we have camera permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      // If we have permission, start scanner
      await startScannerWithPermission();
    } catch (error) {
      console.error("Camera permission check failed:", error);
      if (error.name === 'NotAllowedError') {
        // Request permission explicitly
        await requestCameraPermission();
      } else {
        setScannerError("Camera access failed. Please check your browser settings.");
        setScanStatus("error");
      }
    }
  };

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        // Check if the scanner is actually scanning before trying to stop
        if (scannerRef.current.isScanning && scannerRef.current.isScanning()) {
          await scannerRef.current.stop();
        }
        scannerRef.current = null;
      }
      
      if (isMountedRef.current) {
        setIsScanning(false);
        setScanStatus("ready");
        setScannerError(null);
      }
    } catch (error) {
      console.error("Error stopping scanner:", error);
      // Force reset state even if cleanup fails
      if (isMountedRef.current) {
        setIsScanning(false);
        setScanStatus("ready");
        setScannerError(null);
      }
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate QR code detection for file upload
      const reader = new FileReader();
      reader.onload = () => {
        // For demo purposes, simulate successful scan
        const simulatedQRData = "DEMO_QR_CODE_" + Date.now();
        handleDecodedData(simulatedQRData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDecodedData = useCallback((decodedText) => {
    console.log("QR Code Detected!", decodedText);
    
    // Stop the scanner immediately
    stopScanner();
    
    if (isMountedRef.current) {
      // Set scanner verification flag in localStorage with timestamp
      const verificationData = {
        verified: true,
        timestamp: Date.now(),
        path: window.location.pathname
      };
      localStorage.setItem("scannerVerified", JSON.stringify(verificationData));
      console.log("Scanner verification stored:", verificationData);
      
      // Set success status
      setScanStatus("success");
      setScanResult(decodedText);
      
      // Redirect to common facilities after successful scan
      setTimeout(() => {
        if (isMountedRef.current) {
          navigate("/common-facilities");
        }
      }, 2000);
    }
  }, [stopScanner, navigate]);

  const handleFeatureClick = useCallback((feature) => {
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
  }, [navigate]);

  const resetScanner = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setShowFeatures(false);
        setScanStatus("ready");
        setScanResult(null);
        setScannerError(null);
      }
      await cleanupScanner();
    } catch (error) {
      console.error("Error resetting scanner:", error);
    }
  }, [cleanupScanner]);

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
                <div className="space-y-3">
                  <button
                    onClick={startScanner}
                    disabled={scanStatus === "success"}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto disabled:cursor-not-allowed"
                  >
                    <FaCamera />
                    Start Scanner
                  </button>
                  
                  {/* File Upload Fallback */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Or upload QR code image:</p>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2">
                      <FaQrcode />
                      Upload QR Code
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Debug Button */}
                  <div className="text-center mt-2">
                    <button
                      onClick={() => {
                        console.log("Scanner Debug Info:");
                        console.log("- isScanning:", isScanning);
                        console.log("- scanStatus:", scanStatus);
                        console.log("- scannerRef:", scannerRef.current);
                        console.log("- scannerElement:", document.getElementById('scanner'));
                        console.log("- cameras:", cameras);
                        console.log("- localStorage scannerVerified:", localStorage.getItem("scannerVerified"));
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Debug Scanner
                    </button>
                  </div>
                </div>
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
              className="scanner-container min-h-[400px] w-full max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden"
              style={{ minHeight: '400px', width: '100%', maxWidth: '400px' }}
            >
              {!isScanning && scanStatus === "ready" && (
                <div className="text-center text-gray-500 p-8">
                  <FaQrcode className="text-4xl mx-auto mb-2" />
                  <p>Scanner will appear here when started</p>
                </div>
              )}
              {scanStatus === "scanning" && (
                <div className="text-center text-teal-600 p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                  <p>Initializing camera...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait...</p>
                </div>
              )}
              {scanStatus === "success" && (
                <div className="text-center text-green-600 p-8">
                  <FaCheckCircle className="text-4xl mx-auto mb-2" />
                  <p className="font-medium">QR Code Verified!</p>
                  <p className="text-sm text-gray-500">Redirecting to health features...</p>
                </div>
              )}
              {scanStatus === "error" && (
                <div className="text-center text-red-600 p-8">
                  <FaTimes className="text-4xl mx-auto mb-2" />
                  <p className="font-medium">Scanner Error</p>
                  <p className="text-sm text-gray-500">Check error details below</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-2">How to use:</h4>
              <ol className="text-sm text-teal-700 space-y-1 mb-4">
                <li>1. Click "Start Scanner" to activate your camera</li>
                <li>2. Allow camera permissions when prompted by your browser</li>
                <li>3. Position your Arogyam health card QR code within the scanner frame</li>
                <li>4. Hold steady until the code is detected</li>
                <li>5. You'll be automatically redirected to your health features</li>
              </ol>
              
              {/* Camera Permission Status */}
              <div className="bg-white p-3 rounded border border-teal-200">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${cameras.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs font-medium text-teal-800">
                    Camera Status: {cameras.length > 0 ? 'Available' : 'Checking...'}
                  </span>
                </div>
                {cameras.length === 0 && (
                  <p className="text-xs text-teal-600 mt-1">
                    Click "Start Scanner" to check camera permissions
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {scannerError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FaTimes className="text-red-600 text-xl mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-700 text-sm font-medium mb-2">{scannerError}</p>
                    
                    {/* Troubleshooting tips based on error type */}
                    {scannerError.includes("permission denied") && (
                      <div className="bg-red-100 p-3 rounded border border-red-200">
                        <p className="text-red-800 text-xs font-medium mb-2">How to fix camera permissions:</p>
                        <ul className="text-red-700 text-xs space-y-1">
                          <li>• Click the camera icon in your browser's address bar</li>
                          <li>• Select "Allow" for camera access</li>
                          <li>• Refresh the page and try again</li>
                          <li>• Check browser settings if the icon doesn't appear</li>
                        </ul>
                      </div>
                    )}
                    
                    {scannerError.includes("camera not found") && (
                      <div className="bg-red-100 p-3 rounded border border-red-200">
                        <p className="text-red-800 text-xs font-medium mb-2">Device compatibility:</p>
                        <ul className="text-red-700 text-xs space-y-1">
                          <li>• Ensure your device has a camera</li>
                          <li>• Try using a different browser</li>
                          <li>• Check if camera is enabled in device settings</li>
                        </ul>
                      </div>
                    )}
                    
                    {scannerError.includes("already in use") && (
                      <div className="bg-red-100 p-3 rounded border border-red-200">
                        <p className="text-red-800 text-xs font-medium mb-2">Camera is busy:</p>
                        <ul className="text-red-700 text-xs space-y-1">
                          <li>• Close other apps using the camera</li>
                          <li>• Close other browser tabs with camera access</li>
                          <li>• Wait a few seconds and try again</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => setScannerError(null)}
                    className="text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Dismiss
                  </button>
                  
                  {scannerError.includes("permission") && (
                    <button
                      onClick={requestCameraPermission}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  )}
                </div>
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
