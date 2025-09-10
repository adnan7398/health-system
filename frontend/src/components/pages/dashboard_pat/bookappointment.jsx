import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaCheckCircle, FaArrowRight, FaSearch, FaFilter, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState({
    medicalReason: "",
    notes: "",
    phone: "",
    visitType: "in-person"
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const specialties = [
    { value: "all", label: "All Specialties" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "dermatology", label: "Dermatology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "psychiatry", label: "Psychiatry" }
  ];

  const visitTypes = [
    { value: "in-person", label: "In-Person Visit" },
    { value: "video", label: "Video Consultation" },
    { value: "phone", label: "Phone Consultation" }
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const API_BASE = "http://localhost:3000";
        const response = await fetch(`${API_BASE}/doctor`);
        if (response.ok) {
          const data = await response.json();
          const transformed = data.map(doc => ({
            id: doc._id,
            name: `Dr. ${doc.firstName} ${doc.lastName}`,
            specialty: doc.specialization,
            experience: doc.experience,
            rating: 4.5,
            reviews: 45,
            location: "Medical District",
            phone: "+1 (555) 000-0000",
            email: "doctor@example.com",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
            availableSlots: [],
          }));
          setDoctors(transformed);
          setFilteredDoctors(transformed);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        console.error(error);
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value);
    if (value === "all") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(doc => doc.specialty.toLowerCase() === value.toLowerCase()));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredDoctors(doctors.filter(doc =>
      doc.name.toLowerCase().includes(term.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(term.toLowerCase())
    ));
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
    setSelectedDate("");
    setSelectedTime("");
    // Clear previous slots until a date is picked
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    if (!selectedDoctor) return;
    try {
      setLoading(true);
      const API_BASE = "http://localhost:3000";
      const params = new URLSearchParams({ doctorId: selectedDoctor.id, date });
      const res = await fetch(`${API_BASE}/doctor-availability?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const slots = data.available ? data.availableTimeSlots : [];
        setSelectedTime("");
        // Update selected doctor's available slots locally
        setSelectedDoctor(prev => prev ? { ...prev, availableSlots: slots } : prev);
      }
    } catch (e) {
      console.error("Failed to fetch availability", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }
    try {
      setLoading(true);
      const API_BASE = "http://localhost:3000";
      const res = await fetch(`${API_BASE}/book-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: selectedDate,
          time: selectedTime,
          visitType: appointmentDetails.visitType,
          medicalReason: appointmentDetails.medicalReason,
          notes: appointmentDetails.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }
      setMessage(data.message || "Appointment booked successfully!");
      setMessageType("success");
      setCurrentStep(4);
    } catch (e) {
      console.error(e);
      setMessage(e.message || "Booking failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setAppointmentDetails({
      medicalReason: "",
      notes: "",
      phone: "",
      visitType: "in-person"
    });
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Doctor</h2>
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 mb-4 border rounded-lg"
            />
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {specialties.map(spec => (
                <button
                  key={spec.value}
                  onClick={() => handleSpecialtyChange(spec.value)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedSpecialty === spec.value ? "bg-teal-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="text-center py-8">
                <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
                <p>Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                <p>No doctors found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="p-4 border rounded-lg hover:shadow cursor-pointer transition"
                  >
                    <div className="flex gap-4 items-center">
                      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full" />
                      <div>
                        <h3 className="font-bold">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-sm text-gray-500">{doctor.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && selectedDoctor && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pick Date & Time</h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateString = date.toISOString().split("T")[0];
                  return (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(dateString)}
                      className={`p-2 rounded-lg text-sm ${
                        selectedDate === dateString ? "bg-teal-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {(selectedDoctor.availableSlots && selectedDoctor.availableSlots.length > 0 ? selectedDoctor.availableSlots : ["09:00 AM", "09:30 AM", "10:00 AM"]).map(slot => (
                  <button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    className={`p-2 rounded-lg text-sm ${
                      selectedTime === slot ? "bg-teal-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setCurrentStep(1)} className="px-4 py-2 border rounded-lg">Back</button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`px-4 py-2 rounded-lg ${
                  !selectedDate || !selectedTime ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Visit Type</label>
                <select
                  name="visitType"
                  value={appointmentDetails.visitType}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                >
                  {visitTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Medical Reason</label>
                <textarea
                  name="medicalReason"
                  value={appointmentDetails.medicalReason}
                  onChange={handleInputChange}
                  placeholder="Describe reason for visit"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={appointmentDetails.notes}
                  onChange={handleInputChange}
                  placeholder="Additional details"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <input
                  name="phone"
                  value={appointmentDetails.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 border rounded-lg">Back</button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-lg ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 text-white"
                }`}
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && messageType === "error" && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{message}</div>
        )}

        {currentStep === 3 && messageType === "success" && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>
        )}

        {currentStep === 4 && (
          <div className="text-center">
            <FaCheckCircle className="text-6xl text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Book Another Appointment
            </button>
            <button
              onClick={() => navigate("/userdashboard")}
              className="px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-100 ml-4"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
