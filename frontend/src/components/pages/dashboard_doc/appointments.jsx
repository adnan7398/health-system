import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DoctorSidebar from "./doctorsidebar";
import { FaCalendarCheck, FaCheck, FaEye, FaPlusCircle, FaSearch } from "react-icons/fa";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/doctor/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setAppointments(
        Array.isArray(data.appointments) ? data.appointments : []
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      const response = await fetch("http://localhost:3000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          status: "accepted",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Replace alert with more professional notification
        const authKey = data.authKey;
        // Show a toast or notification instead of an alert
        const notification = document.createElement("div");
        notification.className = "fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50";
        notification.textContent = `Appointment accepted. Auth Key: ${authKey}`;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
        fetchAppointments();
      } else {
        console.error("Error updating appointment:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";

    const appointmentDate = new Date(dateString);

    if (isNaN(appointmentDate.getTime())) {
      return "Invalid Date";
    }

    return format(appointmentDate, "dd/MM/yyyy hh:mm a");
  };
  
  const filteredAppointments = appointments.filter(appointment => {
    const fullName = `${appointment.userId.firstName} ${appointment.userId.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           appointment.userId.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DoctorSidebar />
      <div className="flex-1 ml-64 p-6 transition-all duration-300">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaCalendarCheck className="text-blue-600" />
              Appointments
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  placeholder="Search by patient name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap">
                <FaPlusCircle />
                New Appointment
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-600 text-lg">Loading appointments...</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Patient Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Auth Key</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-slate-200">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-16">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <FaCalendarCheck className="text-6xl text-slate-300" />
                            <p className="text-slate-500 text-lg">No appointments found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-slate-50 transition-colors duration-200">
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            {appointment.userId.firstName} {appointment.userId.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{appointment.userId.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{appointment.userId.address || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{appointment.userId.age || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{appointment.userId.phoneNumber || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatDate(appointment.date)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'accepted' || appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-mono">{appointment.authKey || "N/A"}</td>
                          <td className="px-6 py-4">
                            {appointment.status !== "accepted" ? (
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                                onClick={() => handleAccept(appointment._id)}
                                title="Accept Appointment"
                              >
                                <FaCheck /> Accept
                              </button>
                            ) : (
                              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105" title="View Details">
                                <FaEye /> View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
