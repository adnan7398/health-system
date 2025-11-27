import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSidebar } from "./SidebarContext";

const DoctorSidebar = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useSidebar();
  const API_BASE = import.meta.env.VITE_API_BASE || "https://arogyam-15io.onrender.com";

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        
        if (!token) {
          console.error("No doctor token found in localStorage");
          setLoading(false);
          return;
        }

        console.log("Fetching doctor details from:", `${API_BASE}/doctor/doctors`);
        const response = await fetch(`${API_BASE}/doctor/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", data);

        if (response.ok) {
          if (data.doctor) {
            setDoctor(data.doctor);
            console.log("Doctor details loaded successfully");
          } else {
            console.error("Doctor data is missing in response:", data);
          }
        } else {
          console.error("Error fetching doctor:", data.message || "Unknown error");
          // If token is invalid, redirect to login
          if (response.status === 403 || response.status === 401) {
            localStorage.removeItem("doctorToken");
            navigate("/doctorlogin");
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [navigate]);

  if (loading) {
    return (
      <aside className={`${isOpen ? 'w-64' : 'w-20'} h-screen fixed top-0 left-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 text-white p-6 shadow-xl z-50 flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} h-screen fixed top-0 left-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 text-white p-6 shadow-xl z-50 flex flex-col transition-all duration-300`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 z-10"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <FaTimes className="text-white w-4 h-4" />
        ) : (
          <FaBars className="text-white w-4 h-4" />
        )}
      </button>

      {doctor ? (
        <>
          {isOpen ? (
            <>
              <div className="w-32 h-32 bg-white/20 rounded-full mx-auto my-6 border-4 border-white/30 shadow-lg bg-cover bg-center" 
                   style={{backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/6915/6915987.png')"}}>
              </div>
              
              <h2 className="text-xl font-semibold text-white text-center mb-4 text-shadow-sm">
                <strong>
                  {doctor.firstName} {doctor.lastName}
                </strong>
              </h2>
              
              <div className="space-y-3 flex-1">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-center">
                  <p className="text-sm font-medium text-white/90">
                    <strong>Specialization: {doctor.specialization}</strong>
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-center">
                  <p className="text-sm font-medium text-white/90">
                    <strong>Hospital: {doctor.hospital}</strong>
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-center">
                  <p className="text-sm font-medium text-white/90">
                    <strong>Experience: {doctor.experience} years</strong>
                  </p>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <div className="mt-auto space-y-2">
                <button 
                  onClick={() => navigate("/doctordashboard")}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-center cursor-pointer hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-white/90">Dashboard</span>
                </button>
                <button 
                  onClick={() => navigate("/patient")}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-center cursor-pointer hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-white/90">Patients</span>
                </button>
                <button 
                  onClick={() => navigate("/appointment")}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-center cursor-pointer hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-white/90">Appointments</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Collapsed View */}
              <div className="flex flex-col items-center mt-12 space-y-8">
                <div className="w-12 h-12 bg-white/20 rounded-full border-2 border-white/30 shadow-lg bg-cover bg-center" 
                     style={{backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/6915/6915987.png')"}}>
                </div>
                
                {/* Navigation Menu - Icons Only */}
                <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => navigate("/doctordashboard")}
                    className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-300"
                    title="Dashboard"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate("/patient")}
                    className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-300"
                    title="Patients"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate("/appointment")}
                    className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-300"
                    title="Appointments"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
            <p className="text-sm font-medium text-red-200">Doctor details not found</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DoctorSidebar;
