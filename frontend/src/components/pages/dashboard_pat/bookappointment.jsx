import React, { useState, useEffect } from "react";
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaStar, FaCheckCircle, FaArrowRight, FaSearch, FaFilter, FaSpinner, 
  FaExclamationTriangle, FaHospital, FaGraduationCap, FaAward, FaChevronLeft,
  FaChevronRight, FaTimes
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const specialties = [
    { value: "all", label: "All Specialties" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "dermatology", label: "Dermatology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "general", label: "General Medicine" }
  ];

  const visitTypes = [
    { value: "in-person", label: "In-Person Visit", icon: "🏥" },
    { value: "video", label: "Video Consultation", icon: "📹" },
    { value: "phone", label: "Phone Consultation", icon: "📞" }
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setMessage("");
        const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
        const doctorsUrl = `${API_BASE}/doctors`;
        console.log("=== Fetching Doctors ===");
        console.log("URL:", doctorsUrl);
        console.log("API_BASE:", API_BASE);
        
        const response = await fetch(doctorsUrl);
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Response data type:", Array.isArray(data) ? "Array" : typeof data);
          console.log("Fetched doctors count:", Array.isArray(data) ? data.length : "Not an array");
          console.log("First doctor sample:", Array.isArray(data) && data.length > 0 ? {
            _id: data[0]._id,
            name: `${data[0].firstName} ${data[0].lastName}`,
            specialization: data[0].specialization
          } : "No doctors in response");
          
          if (!Array.isArray(data) || data.length === 0) {
            setMessage("No doctors available at the moment. Please check back later.");
            setMessageType("error");
            setDoctors([]);
            setFilteredDoctors([]);
            return;
          }
          
          const transformed = data.map(doc => {
            // Ensure we use the correct ID format (handle both _id object and string)
            const doctorId = doc._id ? (typeof doc._id === 'string' ? doc._id : doc._id.toString()) : null;
            
            if (!doctorId) {
              console.warn("Doctor missing _id:", doc);
            }
            
            return {
              id: doctorId,
              name: `Dr. ${doc.firstName} ${doc.lastName}`,
              firstName: doc.firstName,
              lastName: doc.lastName,
              specialty: doc.specialization || "General Medicine",
              experience: doc.experience || "N/A",
              hospital: doc.hospital || "Hospital",
              bio: doc.bio || "Experienced healthcare professional",
              rating: 4.5,
              reviews: 45,
              location: doc.hospital || "Medical District",
              phone: doc.phone || "",
              email: doc.email || "",
              image: doc.profileImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
              availableSlots: [],
            };
          });
          setDoctors(transformed);
          setFilteredDoctors(transformed);
          console.log("Transformed doctors:", transformed.length);
          
          // If doctorId is in URL params, auto-select that doctor
          const doctorId = searchParams.get('doctorId');
          if (doctorId) {
            const doctor = transformed.find(d => d.id === doctorId);
            if (doctor) {
              setSelectedDoctor(doctor);
              setCurrentStep(2);
            }
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
        setFilteredDoctors([]);
        setMessage(error.message || "Failed to load doctors. Please check your connection and try again.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [searchParams]);

  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value);
    if (value === "all") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(doc => 
        doc.specialty.toLowerCase().includes(value.toLowerCase())
      ));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      handleSpecialtyChange(selectedSpecialty);
      return;
    }
    setFilteredDoctors(doctors.filter(doc =>
      doc.name.toLowerCase().includes(term.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(term.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(term.toLowerCase())
    ));
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
    setAvailabilityMessage("");
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (!selectedDoctor) return;
    
    try {
      setLoadingAvailability(true);
      setAvailabilityMessage("");
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
      const params = new URLSearchParams({ doctorId: selectedDoctor.id, date });
      const res = await fetch(`${API_BASE}/doctor-availability?${params.toString()}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.available && data.availableTimeSlots && data.availableTimeSlots.length > 0) {
          setAvailableSlots(data.availableTimeSlots);
          setAvailabilityMessage("");
        } else {
          setAvailableSlots([]);
          setAvailabilityMessage(data.message || "No available slots for this date. Please select another date.");
        }
      } else {
        const errorData = await res.json();
        setAvailableSlots([]);
        setAvailabilityMessage(errorData.message || "Failed to fetch availability");
      }
    } catch (e) {
      console.error("Failed to fetch availability", e);
      setAvailableSlots([]);
      setAvailabilityMessage("Error loading availability. Please try again.");
    } finally {
      setLoadingAvailability(false);
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
    
    // Validate token before proceeding
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setMessage("Please login to book an appointment.");
      setMessageType("error");
      return;
    }
    
    try {
      setLoading(true);
      setMessage("");
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
      
      // Validate doctor ID before sending
      if (!selectedDoctor || !selectedDoctor.id) {
        setMessage("Invalid doctor selected. Please select a doctor again.");
        setMessageType("error");
        setLoading(false);
        return;
      }
      
      console.log("Booking appointment with:", {
        doctorId: selectedDoctor.id,
        doctorIdType: typeof selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        visitType: appointmentDetails.visitType,
        token: token ? "Present" : "Missing"
      });
      
      // Ensure doctorId is a string
      const doctorIdToSend = selectedDoctor.id ? String(selectedDoctor.id) : null;
      
      if (!doctorIdToSend) {
        setMessage("Invalid doctor selected. Please select a doctor again.");
        setMessageType("error");
        setLoading(false);
        return;
      }
      
      const res = await fetch(`${API_BASE}/book-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorIdToSend,
          date: selectedDate,
          time: selectedTime,
          visitType: appointmentDetails.visitType,
          medicalReason: appointmentDetails.medicalReason,
          notes: appointmentDetails.notes,
          phone: appointmentDetails.phone,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          setMessage("Your session has expired. Please login again.");
          setMessageType("error");
          // Clear invalid token
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
          return;
        }
        
        // Handle specific error messages
        let errorMessage = data.message || "Booking failed";
        if (errorMessage.includes("User not found")) {
          errorMessage = "Your session has expired. Please login again.";
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
        } else if (errorMessage.includes("Doctor not found")) {
          errorMessage = "The selected doctor is no longer available. Please select another doctor.";
          // Reset to step 1 to allow selecting a new doctor
          setCurrentStep(1);
          setSelectedDoctor(null);
        }
        
        throw new Error(errorMessage);
      }
      
      setMessage(data.message || "Appointment booked successfully!");
      setMessageType("success");
      setCurrentStep(4);
    } catch (e) {
      console.error("Booking error:", e);
      setMessage(e.message || "Booking failed. Please try again.");
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
    setAvailableSlots([]);
    setAvailabilityMessage("");
    setAppointmentDetails({
      medicalReason: "",
      notes: "",
      phone: "",
      visitType: "in-person"
    });
    setMessage("");
    setMessageType("");
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  currentStep >= step 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <FaCheckCircle /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-2 text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'font-semibold text-teal-600' : ''}>Select Doctor</span>
            <span className={currentStep >= 2 ? 'font-semibold text-teal-600' : ''}>Date & Time</span>
            <span className={currentStep >= 3 ? 'font-semibold text-teal-600' : ''}>Details</span>
            <span className={currentStep >= 4 ? 'font-semibold text-teal-600' : ''}>Confirm</span>
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Doctor</h2>
              <p className="text-gray-600">Choose from our experienced healthcare professionals</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or hospital..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {specialties.map(spec => (
                  <button
                    key={spec.value}
                    onClick={() => handleSpecialtyChange(spec.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedSpecialty === spec.value
                        ? "bg-teal-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {spec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors List */}
            {message && messageType === "error" && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center gap-2 text-red-700">
                  <FaExclamationTriangle />
                  <p>{message}</p>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-16">
                <FaSpinner className="animate-spin text-5xl text-teal-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-16">
                <FaExclamationTriangle className="text-5xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No doctors found.</p>
                <p className="text-gray-500 text-sm mt-2">
                  {message || "Try adjusting your search or filters."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="bg-gradient-to-br from-white to-teal-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-teal-500 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-20 h-20 rounded-full object-cover border-4 border-teal-100 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{doctor.name}</h3>
                        <p className="text-sm text-teal-600 font-medium mb-2">{doctor.specialty}</p>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <FaStar />
                          <span className="text-gray-700">{doctor.rating}</span>
                          <span className="text-gray-500">({doctor.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaHospital className="text-teal-500" />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-teal-500" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      {doctor.bio && (
                        <p className="text-gray-500 text-xs line-clamp-2 mt-2">{doctor.bio}</p>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      Book Appointment <FaArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Pick Date & Time */}
        {currentStep === 2 && selectedDoctor && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Doctor Info Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-16 h-16 rounded-full border-4 border-white/30"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedDoctor.name}</h2>
                  <p className="text-teal-100">{selectedDoctor.specialty} • {selectedDoctor.hospital}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-teal-600" />
                Select Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {getAvailableDates().map((date, i) => {
                  const dateString = date.toISOString().split("T")[0];
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = i === 0;
                  return (
                    <button
                      key={dateString}
                      onClick={() => !isWeekend && handleDateSelect(dateString)}
                      disabled={isWeekend}
                      className={`p-4 rounded-xl text-center transition-all ${
                        selectedDate === dateString
                          ? "bg-teal-600 text-white shadow-lg scale-105"
                          : isWeekend
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-50 text-gray-700 hover:bg-teal-50 hover:border-2 hover:border-teal-300 border-2 border-transparent"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">{formatDate(date).split(' ')[0]}</div>
                      <div className={`text-2xl font-bold ${isToday ? 'text-teal-600' : ''}`}>
                        {date.getDate()}
                      </div>
                      <div className="text-xs mt-1">{formatDate(date).split(' ').slice(1).join(' ')}</div>
                      {isToday && <div className="text-xs mt-1 font-medium">Today</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-teal-600" />
                Select Time Slot
              </h3>
              {loadingAvailability ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-3xl text-teal-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading available slots...</p>
                </div>
              ) : !selectedDate ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Please select a date first</p>
                </div>
              ) : availabilityMessage ? (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                  <FaExclamationTriangle className="text-3xl text-amber-500 mx-auto mb-2" />
                  <p className="text-amber-700 font-medium">{availabilityMessage}</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-gray-600">No available slots for this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`p-3 rounded-xl text-center font-medium transition-all ${
                        selectedTime === slot
                          ? "bg-teal-600 text-white shadow-lg scale-105"
                          : "bg-gray-50 text-gray-700 hover:bg-teal-50 hover:border-2 hover:border-teal-300 border-2 border-transparent"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setCurrentStep(1)} 
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FaChevronLeft /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  !selectedDate || !selectedTime
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                }`}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Appointment Details</h2>
            
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-teal-200">
              <h3 className="font-bold text-gray-900 mb-4">Appointment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Doctor</p>
                  <p className="font-semibold text-gray-900">{selectedDoctor?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Specialty</p>
                  <p className="font-semibold text-gray-900">{selectedDoctor?.specialty}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">
                    {selectedDate ? formatDate(selectedDate) : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-semibold text-gray-900">{selectedTime || "Not selected"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visit Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {visitTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setAppointmentDetails(prev => ({ ...prev, visitType: type.value }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        appointmentDetails.visitType === type.value
                          ? "border-teal-600 bg-teal-50"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-700">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="medicalReason"
                  value={appointmentDetails.medicalReason}
                  onChange={handleInputChange}
                  placeholder="Describe the reason for your visit..."
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={appointmentDetails.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={appointmentDetails.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-xl ${
                messageType === "error" 
                  ? "bg-red-50 border-2 border-red-200 text-red-700"
                  : "bg-green-50 border-2 border-green-200 text-green-700"
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setCurrentStep(2)} 
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FaChevronLeft /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !appointmentDetails.medicalReason}
                className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  loading || !appointmentDetails.medicalReason
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Booking...
                  </>
                ) : (
                  <>
                    Confirm Appointment <FaCheckCircle />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-6xl text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Your appointment has been successfully booked. You will receive a confirmation email shortly.
            </p>
            <div className="bg-teal-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <div className="text-left space-y-2 text-sm">
                <p><span className="font-semibold">Doctor:</span> {selectedDoctor?.name}</p>
                <p><span className="font-semibold">Date:</span> {selectedDate ? formatDate(selectedDate) : ""}</p>
                <p><span className="font-semibold">Time:</span> {selectedTime}</p>
                <p><span className="font-semibold">Visit Type:</span> {appointmentDetails.visitType}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium transition-colors shadow-lg"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => navigate("/userdashboard")}
                className="px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 font-medium transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
