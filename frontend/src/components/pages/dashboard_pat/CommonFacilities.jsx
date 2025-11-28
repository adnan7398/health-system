import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaQrcode, FaHeartbeat, FaUserMd, FaCalendarCheck, FaFileMedical, FaRobot, FaCheckCircle, FaArrowRight, FaShieldAlt, FaUser, FaHospital, FaFlask, FaAmbulance, FaBrain, FaRunning, FaLeaf, FaCamera, FaTimes, FaInfoCircle } from "react-icons/fa";

const CommonFacilities = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Check if scanner is verified
    let scannerVerified = false;
    try {
      const verificationData = localStorage.getItem("scannerVerified");
      if (verificationData) {
        const parsed = JSON.parse(verificationData);
        scannerVerified = parsed.verified === true;
      }
    } catch (error) {
      console.error("Error parsing scanner verification:", error);
    }
    
    if (!scannerVerified) {
      navigate("/scanner");
      return;
    }

    // Fetch user profile
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
      const response = await fetch(`${API_BASE}/register/${userId}`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureClick = (feature) => {
    // Ensure scanner verification is maintained
    let scannerVerified = false;
    try {
      const verificationData = localStorage.getItem("scannerVerified");
      if (verificationData) {
        const parsed = JSON.parse(verificationData);
        scannerVerified = parsed.verified === true;
      }
    } catch (error) {
      console.error("Error parsing scanner verification:", error);
    }
    
    if (!scannerVerified) {
      console.log("Scanner verification lost, redirecting to scanner");
      navigate("/scanner");
      return;
    }

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
      case "scanner":
        navigate("/scanner");
        break;
      default:
        navigate("/userdashboard");
    }
  };

  const features = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Access your complete health overview and recent activities",
      icon: <FaUser className="text-2xl" />,
      color: "from-emerald-500 to-emerald-600",
      protected: true
    },
    {
      id: "appointments",
      title: "Book Appointments",
      description: "Schedule consultations with healthcare professionals",
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "from-emerald-600 to-emerald-700",
      protected: true
    },
    {
      id: "reports",
      title: "Medical Reports",
      description: "View and manage your medical test results and reports",
      icon: <FaFileMedical className="text-2xl" />,
      color: "from-emerald-700 to-emerald-800",
      protected: true
    },
    {
      id: "chatbot",
      title: "Health Assistant",
      description: "Get instant health guidance and support from AI",
      icon: <FaRobot className="text-2xl" />,
      color: "from-emerald-500 to-emerald-600",
      protected: true
    },
    {
      id: "healthcard",
      title: "Health Card",
      description: "Access your digital health card and QR code",
      icon: <FaQrcode className="text-2xl" />,
      color: "from-emerald-600 to-emerald-700",
      protected: true
    },
    {
      id: "fitness",
      title: "Fitness Plans",
      description: "Personalized workout and nutrition recommendations",
      icon: <FaRunning className="text-2xl" />,
      color: "from-emerald-700 to-emerald-800",
      protected: true
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading facilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      {/* Header Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Welcome to Your Health Hub</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Scanner verification completed! You now have access to common health facilities. 
            Complete your health card registration to unlock all premium features.
          </p>
          
          {/* Scanner Status */}
          <div className="mt-8 p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 inline-block">
            <div className="flex items-center space-x-3">
              <FaQrcode className="text-2xl" />
              <span className="font-medium">Scanner Verified ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Available Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All features are now accessible after scanner verification. 
              Scanner serves as your entry gate to the entire healthcare system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="group cursor-pointer" onClick={() => handleFeatureClick(feature.id)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative bg-white p-8 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center mb-4">{feature.description}</p>
                  
                  {/* Access Status */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <FaCheckCircle className="text-xs" />
                      <span>Accessible Now</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Full Access Granted!</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Scanner verification completed! You now have access to all healthcare features. 
            The scanner serves as your entry gate to the entire system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/userdashboard")}
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <FaUser className="text-xl" />
              <span>Go to Dashboard</span>
              <FaArrowRight className="text-lg" />
            </button>
            
            <button
              onClick={() => navigate("/scanner")}
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
            >
              <FaCamera className="text-xl" />
              <span>Scan Again</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommonFacilities;
