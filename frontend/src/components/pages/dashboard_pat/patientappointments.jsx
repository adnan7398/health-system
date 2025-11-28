import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
// Removed sidebar for a cleaner standalone appointments page

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
      const response = await fetch(`${API_BASE}/appointments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.appointments) {
        setAppointments(data.appointments);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage and view your upcoming and past appointments</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.slice(0, 6).map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleOpenModal(appointment)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize">{appointment.status || 'Pending'}</span>
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                    </h3>
                    <p className="text-emerald-700 text-sm font-medium">
                      {appointment.doctorId?.specialization}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {appointment.date ? formatDate(appointment.date) : 'Date TBD'}
                      </span>
                    </div>
                    {appointment.time && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">You don't have any appointments scheduled yet.</p>
            </div>
          )}
      </div>

      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6 mt-10">
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span className="ml-2 capitalize">{selectedAppointment.status || 'Pending'}</span>
                  </span>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Doctor Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span> Dr. {selectedAppointment.doctorId?.firstName} {selectedAppointment.doctorId?.lastName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Specialization:</span> {selectedAppointment.doctorId?.specialization}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-600" />
                    Patient Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span> {selectedAppointment.userId?.firstName} {selectedAppointment.userId?.lastName}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedAppointment.userId?.email}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Appointment Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {selectedAppointment.date ? formatDate(selectedAppointment.date) : 'Date TBD'}
                    </p>
                    {selectedAppointment.time && (
                      <p className="text-gray-700 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        {selectedAppointment.time}
                      </p>
                    )}
                    {selectedAppointment.visitType && (
                      <p className="text-gray-700">
                        <span className="font-medium">Visit Type:</span> <span className="capitalize">{selectedAppointment.visitType}</span>
                      </p>
                    )}
                    {selectedAppointment.medicalReason && (
                      <p className="text-gray-700">
                        <span className="font-medium">Medical Reason:</span> {selectedAppointment.medicalReason}
                      </p>
                    )}
                    {selectedAppointment.notes && (
                      <p className="text-gray-700">
                        <span className="font-medium">Notes:</span> {selectedAppointment.notes}
                      </p>
                    )}
                    {selectedAppointment.authKey && (
                      <p className="text-gray-700 font-mono text-sm">
                        <span className="font-medium">Auth Key:</span> {selectedAppointment.authKey}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
