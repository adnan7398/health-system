import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // If not authenticated, render a Navigate to /login with the current location saved
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated: render children
  return children;
};

export default ProtectedRoute;
