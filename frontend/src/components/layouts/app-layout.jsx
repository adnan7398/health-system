import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header"; // Default Header
import DoctorHeader from "../pages/dashboard_doc/headerdoc"; // Doctor Header

const AppLayout = () => {
  const [userType, setUserType] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const updateUserType = () => {
      // Prefer route-based header selection to avoid stale tokens showing the wrong header
      const doctorRoutes = new Set([
        "/doctordashboard",
        "/appointment",
        "/patient",
        "/conference",
        "/breastcancer",
        "/heartdisease",
        "/pcod",
        "/pneumonia",
      ]);

      if (doctorRoutes.has(location.pathname) || location.pathname.startsWith("/doctor")) {
        setUserType("doctor");
        return;
      }

      // Otherwise show patient/general header
      setUserType("patient");
    };

    updateUserType();

    window.addEventListener("storage", updateUserType);
    return () => window.removeEventListener("storage", updateUserType);
  }, [location]);

  // Routes where header should be hidden
  const noHeaderRoutes = ["/signin", "/doctor/signin", "/doctorlogin"];
  const shouldHideHeader = noHeaderRoutes.includes(location.pathname);

  return (
    <div>
      <main>
        {!shouldHideHeader && (userType === "doctor" ? <DoctorHeader /> : <Header />)}

        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
