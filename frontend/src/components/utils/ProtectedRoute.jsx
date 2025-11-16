import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import HealthCardRequired from './HealthCardRequired';

const ProtectedRoute = ({ children, requireHealthCard = false, isScannerRoute = false, allowWithoutScanner = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHealthCardVerified, setIsHealthCardVerified] = useState(false);
  const [isScannerVerified, setIsScannerVerified] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndStatus = async () => {
      // Check both localStorage and sessionStorage for token
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const doctorToken = localStorage.getItem("doctortoken") || sessionStorage.getItem("doctortoken");
      
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

          // Check scanner verification status from localStorage and sessionStorage
          let scannerVerified = false;
          try {
            const verificationData = localStorage.getItem("scannerVerified") || sessionStorage.getItem("scannerVerified");
            if (verificationData) {
              const parsed = JSON.parse(verificationData);
              scannerVerified = parsed.verified === true;
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
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

  // If this is aadhaar registration, allow access (for new users)
  if (location.pathname === '/aadhaar-registration') {
    return children;
  }

  // If route allows access without scanner verification (e.g., viewing own QR code)
  if (allowWithoutScanner) {
    return children;
  }

  // Scanner verification is required for ALL facilities (common and protected)
  // Check this FIRST before checking isNewUser, so that if scanner is verified, user can access dashboard
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
    
    // If scanner verification is corrupted, clear it
    const verificationData = localStorage.getItem("scannerVerified") || sessionStorage.getItem("scannerVerified");
    if (verificationData) {
      try {
        JSON.parse(verificationData);
      } catch (error) {
        console.log("Corrupted scanner verification data, clearing");
        localStorage.removeItem("scannerVerified");
        sessionStorage.removeItem("scannerVerified");
      }
    }
    
    // Show "Please scan your card" message instead of redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Scan Your Card to Login</h2>
            <p className="text-gray-600 mb-6">
              You need to scan your health card first to access this feature and all other facilities. This is a one-time security verification step.
            </p>
            <button
              onClick={() => navigate("/scanner", { replace: true })}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Scanner
            </button>
            <p className="text-sm text-gray-500 mt-4">
              This is a one-time verification step for security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has completed scanner verification (or is a doctor)
  // For new users, we can optionally redirect to health card registration, but only if not already on dashboard
  // Since scanner is verified, allow access to dashboard
  if (userRole === 'patient' && isNewUser && location.pathname === '/userdashboard') {
    // Allow access to dashboard even if new user, since scanner is verified
    return children;
  }

  // User is authenticated and has completed scanner verification (or is a doctor), render the content
  return children;
};

export default ProtectedRoute;
