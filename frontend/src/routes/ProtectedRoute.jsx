import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const storageToken = localStorage.getItem("token") || sessionStorage.getItem("token");

  // allow these public routes to render even when unauthenticated
  const publicPaths = ["/login", "/signup", "/forgot-password"];

  const [checking, setChecking] = useState(false);
  const [isAuth, setIsAuth] = useState(!!storageToken);

  useEffect(() => {
    // If we already have a token in storage, consider authenticated.
    if (isAuth) return;

    // No token in storage: ask backend if the current client session (cookie) is authenticated.
    // Endpoint should return something like { authenticated: true } when session cookie is valid.
    const verify = async () => {
      setChecking(true);
      try {
        const res = await fetch("https://arogyam-15io.onrender.com/auth/verify", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          setIsAuth(false);
        } else {
          const body = await res.json();
          // adjust according to your API response shape
          if (body && (body.authenticated === true || body.success === true)) {
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        }
      } catch (err) {
        console.error("Auth verify error:", err);
        setIsAuth(false);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [isAuth]);

  if (!storageToken) {
    if (checking) {
      // don't redirect while verifying server-side session; prevent flicker
      return null; // or a small spinner component
    }

    if (isAuth) {
      // verified by backend via cookie/session
      return children;
    }

    if (publicPaths.includes(location.pathname)) {
      return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated: render children
  return children;
};

export default ProtectedRoute;
