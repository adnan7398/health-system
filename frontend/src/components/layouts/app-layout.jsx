import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header"; // Default Header
import DoctorHeader from "../pages/dashboard(doc)/headerdoc"; // Doctor Header

const AppLayout = () => {
  const [userType, setUserType] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const updateUserType = () => {
      const doctorToken = localStorage.getItem("doctorToken");
      const patientToken = localStorage.getItem("token");

      if (doctorToken) {
        console.log("Doctor Logged In");
        setUserType("doctor");
      } else if (patientToken) {
        console.log("Patient Logged In");
        setUserType("patient");
      } else {
        setUserType(null);
      }
    };

    updateUserType();

    // Listen for localStorage changes (Logout updates)
    window.addEventListener("storage", updateUserType);
    return () => window.removeEventListener("storage", updateUserType);
  }, [location]);

  return (
    <div>
      <main>
        {/* Debugging Output */}
        {console.log("Rendering userType:", userType)}

        {/* Show DoctorHeader only for doctors */}
        {userType === "doctor" ? <DoctorHeader /> : <Header />}

        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
