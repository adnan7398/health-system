import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DoctorLayout from "./DoctorLayout";
import { FaCalendarCheck, FaCheck, FaEye, FaPlusCircle, FaSearch, FaTimes } from "react-icons/fa";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("doctorToken");
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/doctor/appointments`,
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
      const response = await fetch(`${API_BASE}/update`, {
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
        const authKey = data.authKey;
        showNotification(`Appointment accepted. Auth Key: ${authKey}`, "success");
        fetchAppointments();
      } else {
        showNotification(data.message || "Failed to accept appointment", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error accepting appointment. Please try again.", "error");
    }
  };

  const handleReject = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to reject this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          status: "rejected",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification("Appointment rejected successfully", "success");
        fetchAppointments();
      } else {
        showNotification(data.message || "Failed to reject appointment", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error rejecting appointment. Please try again.", "error");
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    const bgColor = type === "success" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700";
    notification.className = `fixed top-5 right-5 ${bgColor} border-l-4 p-4 rounded shadow-lg z-50 max-w-md`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
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
    <DoctorLayout>
      <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-teal-200 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaCalendarCheck className="text-teal-600" />
              Appointments
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 text-sm" />
                <input 
                  type="text" 
                  placeholder="Search by patient name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap">
                <FaPlusCircle />
                New Appointment
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <p className="text-teal-700 text-lg">Loading appointments...</p>
            </div>
          ) : (
            <div className="bg-white border border-teal-100 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gradient-to-r from-teal-50 to-emerald-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Patient Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Address</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Auth Key</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Visit Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-16">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <FaCalendarCheck className="text-6xl text-teal-300" />
                            <p className="text-teal-600 text-lg">No appointments found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-teal-50 transition-colors duration-200">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {appointment.userId.firstName} {appointment.userId.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap truncate max-w-[200px]">{appointment.userId.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap truncate max-w-[150px]">{appointment.userId.address || "N/A"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{appointment.userId.age || "N/A"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{appointment.userId.phoneNumber || "N/A"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{formatDate(appointment.date)}</span>
                              {appointment.time && <span className="text-teal-600 text-xs">{appointment.time}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                              appointment.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              appointment.status === 'accepted' || appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">{appointment.authKey || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {appointment.visitType && <span className="capitalize">{appointment.visitType}</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {appointment.status === "pending" && (
                                <>
                                  <button
                                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-300"
                                    onClick={() => handleAccept(appointment._id)}
                                    title="Accept Appointment"
                                  >
                                    <FaCheck className="text-xs" /> Accept
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-300"
                                    onClick={() => handleReject(appointment._id)}
                                    title="Reject Appointment"
                                  >
                                    <FaTimes className="text-xs" /> Reject
                                  </button>
                                </>
                              )}
                              {(appointment.status === "accepted" || appointment.status === "confirmed") && (
                                <button className="bg-teal-100 hover:bg-teal-200 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-300" title="View Details">
                                  <FaEye className="text-xs" /> View
                                </button>
                              )}
                              {appointment.status === "rejected" && (
                                <span className="text-red-600 text-xs font-medium">Rejected</span>
                              )}
                            </div>
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
    </DoctorLayout>
  );
};

export default AppointmentsPage;
