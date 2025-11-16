import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorSidebar = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = "https://arogyam-15io.onrender.com";

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const response = await fetch(`${API_BASE}/doctor/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDoctor(data.doctor);
        } else {
          console.error("Error fetching doctor:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, []);

  if (loading) {
    return (
      <aside className="w-64 h-screen fixed top-0 left-0 bg-gradient-to-b from-teal-600 via-teal-700 to-blue-800 text-white p-6 shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gradient-to-b from-teal-600 via-teal-700 to-blue-800 text-white p-6 shadow-xl z-50 flex flex-col">
      {doctor ? (
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
