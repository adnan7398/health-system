import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserStatusChecker = ({ children }) => {
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    isHealthCardRegistered: false,
    isLoading: true
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setUserStatus({
          isAuthenticated: false,
          isHealthCardRegistered: false,
          isLoading: false
        });
        return;
      }

      // Check health card status
      const response = await fetch("https://arogyam-15io.onrender.com/health-card-status", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserStatus({
          isAuthenticated: true,
          isHealthCardRegistered: data.isHealthCardRegistered || false,
          isLoading: false
        });
      } else {
        // Token might be invalid
        localStorage.removeItem("token");
        setUserStatus({
          isAuthenticated: false,
          isHealthCardRegistered: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      setError("Failed to check user status");
      setUserStatus({
        isAuthenticated: false,
        isHealthCardRegistered: false,
        isLoading: false
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const performCheck = async () => {
      await checkUserStatus();
      // Only update state if component is still mounted
      if (isMounted) {
        // State update handled in checkUserStatus
      }
    };

    performCheck();

    return () => {
      isMounted = false;
    };
  }, [checkUserStatus]);

  const handleGetStarted = useCallback(() => {
    try {
      if (!userStatus.isAuthenticated) {
        navigate("/signin");
      } else if (!userStatus.isHealthCardRegistered) {
        navigate("/aadhaar-registration");
      } else {
        navigate("/userdashboard");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to window.location if navigate fails
      if (!userStatus.isAuthenticated) {
        window.location.href = "/signin";
      } else if (!userStatus.isHealthCardRegistered) {
        window.location.href = "/aadhaar-registration";
      } else {
        window.location.href = "/userdashboard";
      }
    }
  }, [userStatus.isAuthenticated, userStatus.isHealthCardRegistered, navigate]);

  const handleLearnMore = useCallback(() => {
    try {
      if (userStatus.isAuthenticated && userStatus.isHealthCardRegistered) {
        navigate("/userdashboard");
      } else if (userStatus.isAuthenticated) {
        navigate("/aadhaar-registration");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to window.location if navigate fails
      if (userStatus.isAuthenticated && userStatus.isHealthCardRegistered) {
        window.location.href = "/userdashboard";
      } else if (userStatus.isAuthenticated) {
        window.location.href = "/aadhaar-registration";
      } else {
        window.location.href = "/signin";
      }
    }
  }, [userStatus.isAuthenticated, userStatus.isHealthCardRegistered, navigate]);

  // Show loading state instead of null to prevent DOM issues
  if (userStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Pass the user status and handlers to children
  return children({
    userStatus,
    handleGetStarted,
    handleLearnMore
  });
};

export default UserStatusChecker;
