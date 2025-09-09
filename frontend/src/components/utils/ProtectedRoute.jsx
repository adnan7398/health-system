import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import HealthCardRequired from './HealthCardRequired';

const ProtectedRoute = ({ children, requireHealthCard = false, isScannerRoute = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHealthCardVerified, setIsHealthCardVerified] = useState(false);
  const [isScannerVerified, setIsScannerVerified] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndStatus = async () => {
      const token = localStorage.getItem("token");
      const doctorToken = localStorage.getItem("doctortoken");
      
      if (token || doctorToken) {
        setIsAuthenticated(true);
        
        // Check if it's a doctor (doctors don't need verification)
        if (doctorToken) {
          setUserRole('doctor');
          setIsHealthCardVerified(true);
          setIsScannerVerified(true);
          setIsNewUser(false);
        } else {
          setUserRole('patient');
          
          // Check health card status for patients
          try {
            const response = await fetch("https://arogyam-15io.onrender.com/health-card-status", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });

            if (response.ok) {
              const data = await response.json();
              setIsHealthCardVerified(data.isHealthCardRegistered || false);
              
              // Check if user has basic profile data to determine if they're new
              if (data.user && data.user.firstName && data.user.lastName) {
                setIsNewUser(false);
              } else {
                setIsNewUser(true);
              }
            } else {
              setIsHealthCardVerified(false);
              setIsNewUser(true);
            }
          } catch (error) {
            console.error("Error checking health card status:", error);
            setIsHealthCardVerified(false);
            setIsNewUser(true);
          }

          // Check scanner verification status from localStorage
          let scannerVerified = false;
          try {
            const verificationData = localStorage.getItem("scannerVerified");
            if (verificationData) {
              const parsed = JSON.parse(verificationData);
              scannerVerified = parsed.verified === true;
              
              // Check if verification is not too old (24 hours)
              if (parsed.timestamp && (Date.now() - parsed.timestamp) > 24 * 60 * 60 * 1000) {
                console.log("Scanner verification expired, clearing");
                localStorage.removeItem("scannerVerified");
                scannerVerified = false;
              }
            }
          } catch (error) {
            console.error("Error parsing scanner verification:", error);
            scannerVerified = false;
          }
          
          setIsScannerVerified(scannerVerified);
        }
      } else {
        setIsAuthenticated(false);
        setIsHealthCardVerified(false);
        setIsScannerVerified(false);
        setIsNewUser(false);
      }
      setIsLoading(false);
    };

    checkAuthAndStatus();

    // Listen for changes in localStorage
    window.addEventListener("storage", checkAuthAndStatus);
    
    // Also listen for custom storage events
    window.addEventListener("localStorageChange", checkAuthAndStatus);

    return () => {
      window.removeEventListener("storage", checkAuthAndStatus);
      window.removeEventListener("localStorageChange", checkAuthAndStatus);
    };
  }, []);

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the intended destination
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If this is the scanner route, allow access for all authenticated users
  if (isScannerRoute) {
    return children;
  }

  // For new users, redirect to health card registration (one-time setup)
  if (userRole === 'patient' && isNewUser) {
    return <Navigate to="/aadhaar-registration" state={{ from: location }} replace />;
  }

  // Scanner verification is required for ALL facilities (common and protected)
  if (userRole === 'patient' && !isScannerVerified) {
    console.log("Scanner verification check failed:");
    console.log("- User role:", userRole);
    console.log("- Scanner verified:", isScannerVerified);
    console.log("- Current pathname:", location.pathname);
    console.log("- localStorage scannerVerified:", localStorage.getItem("scannerVerified"));
    
    // Check if we're already on the scanner page to prevent redirect loops
    if (location.pathname === '/scanner') {
      return children;
    }
    
    // Check if we're on aadhaar-registration page (allowed for new users)
    if (location.pathname === '/aadhaar-registration') {
      return children;
    }
    
    // Check if we're on common-facilities page (user has already passed scanner)
    if (location.pathname === '/common-facilities') {
      return children;
    }
    
    // If scanner verification is corrupted, clear it and redirect to scanner
    if (localStorage.getItem("scannerVerified")) {
      try {
        JSON.parse(localStorage.getItem("scannerVerified"));
      } catch (error) {
        console.log("Corrupted scanner verification data, clearing");
        localStorage.removeItem("scannerVerified");
      }
    }
    
    // Redirect to scanner as entry gate
    console.log("Redirecting to scanner - verification required for:", location.pathname);
    return <Navigate to="/scanner" state={{ from: location }} replace />;
  }

  // User is authenticated and has completed scanner verification (or is a doctor), render the content
  return children;
};

export default ProtectedRoute;
