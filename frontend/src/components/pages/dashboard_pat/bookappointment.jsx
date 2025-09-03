import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStethoscope, FaHospital, FaStar, FaCheckCircle, FaArrowRight, FaSearch, FaFilter, FaCalendarCheck, FaNotesMedical, FaUser, FaSpinner, FaExclamationTriangle, FaInfoCircle, FaClock as FaClockIcon, FaMapMarkerAlt as FaMapIcon, FaPhone as FaPhoneIcon, FaEnvelope as FaEnvelopeIcon } from "react-icons/fa";

const BookAppointment = () => {
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

  const totalSteps = 4;
  const steps = [
    { number: 1, title: "Select Doctor", description: "Choose your healthcare provider" },
    { number: 2, title: "Pick Date & Time", description: "Schedule your appointment" },
    { number: 3, title: "Appointment Details", description: "Provide visit information" },
    { number: 4, title: "Confirmation", description: "Review and confirm" }
  ];

  const specialties = [
    { value: "all", label: "All Specialties", color: "from-slate-500 to-slate-600" },
    { value: "cardiology", label: "Cardiology", color: "from-red-500 to-pink-500" },
    { value: "neurology", label: "Neurology", color: "from-purple-500 to-indigo-500" },
    { value: "orthopedics", label: "Orthopedics", color: "from-blue-500 to-cyan-500" },
    { value: "dermatology", label: "Dermatology", color: "from-green-500 to-emerald-500" },
    { value: "pediatrics", label: "Pediatrics", color: "from-yellow-500 to-orange-500" },
    { value: "psychiatry", label: "Psychiatry", color: "from-indigo-500 to-blue-500" }
  ];

  const visitTypes = [
    { value: "in-person", label: "In-Person Visit", icon: FaUser, color: "from-blue-500 to-cyan-500" },
    { value: "video", label: "Video Consultation", icon: FaPhone, color: "from-green-500 to-emerald-500" },
    { value: "phone", label: "Phone Consultation", icon: FaPhone, color: "from-purple-500 to-pink-500" }
  ];

  useEffect(() => {
    // Fetch real doctors data from backend
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/doctors");
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our component structure
          const transformedDoctors = data.map(doctor => ({
            id: doctor._id,
            name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            specialty: doctor.specialization,
            hospital: "Medical Center", // Default since not in API
            experience: doctor.experience,
            rating: 4.5, // Default rating
            reviews: Math.floor(Math.random() * 100) + 20, // Random reviews
            location: "Medical District", // Default location
            phone: "+1 (555) 000-0000", // Default phone
            email: "doctor@medical.com", // Default email
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face", // Default image
            availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"], // Default slots
            languages: ["English"], // Default language
            education: "Medical School", // Default education
            certifications: ["Board Certified"] // Default certification
          }));
          setDoctors(transformedDoctors);
          setFilteredDoctors(transformedDoctors);
        } else {
          console.error("Failed to fetch doctors:", response.status);
          // Fallback to mock data if API fails
          setMockDoctors();
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // Fallback to mock data if API fails
        setMockDoctors();
      } finally {
        setLoading(false);
      }
    };

    // Fallback mock data function
    const setMockDoctors = () => {
      const mockDoctors = [
        {
          id: 1,
          name: "Dr. Sarah Wilson",
          specialty: "Cardiology",
          hospital: "City General Hospital",
          experience: "15 years",
          rating: 4.8,
          reviews: 127,
          location: "Downtown Medical Center",
          phone: "+1 (555) 123-4567",
          email: "sarah.wilson@citygen.com",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
          availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
          languages: ["English", "Spanish"],
          education: "Harvard Medical School",
          certifications: ["Board Certified Cardiologist", "Fellow of American College of Cardiology"]
        },
        {
          id: 2,
          name: "Dr. Michael Chen",
          specialty: "Neurology",
          hospital: "Neurological Institute",
          experience: "12 years",
          rating: 4.9,
          reviews: 89,
          location: "Medical District",
          phone: "+1 (555) 234-5678",
          email: "michael.chen@neuroinst.com",
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
          availableSlots: ["11:00 AM", "01:00 PM", "04:00 PM"],
          languages: ["English", "Mandarin"],
          education: "Stanford Medical School",
          certifications: ["Board Certified Neurologist", "Member of American Academy of Neurology"]
        },
        {
          id: 3,
          name: "Dr. Emily Rodriguez",
          specialty: "Pediatrics",
          hospital: "Children's Medical Center",
          experience: "8 years",
          rating: 4.7,
          reviews: 156,
          location: "Family Health Plaza",
          phone: "+1 (555) 345-6789",
          email: "emily.rodriguez@childrensmed.com",
          image: "https://images.unsplash.com/photo-1594824475544-3d9c2c3c3c3c?w=150&h=150&fit=crop&crop=face",
          availableSlots: ["08:00 AM", "10:30 AM", "01:30 PM", "03:30 PM"],
          languages: ["English", "Spanish"],
          education: "Johns Hopkins Medical School",
          certifications: ["Board Certified Pediatrician", "Member of American Academy of Pediatrics"]
        }
      ];
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors]);

  const filterDoctors = () => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(doctor =>
        doctor.specialty.toLowerCase() === selectedSpecialty
      );
    }
    
    setFilteredDoctors(filtered);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      slots.push(time);
      if (hour < 17) {
        const halfTime = `${hour.toString().padStart(2, '0')}:30 ${hour < 12 ? 'AM' : 'PM'}`;
        slots.push(halfTime);
      }
    }
    return slots;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setMessage("");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMessage("");
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setMessage("");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setMessage("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentDetails.medicalReason) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage("Appointment booked successfully!");
      setMessageType("success");
      setCurrentStep(4);
    } catch (error) {
      setMessage("Failed to book appointment. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedDoctor !== null;
    }
    if (currentStep === 2) {
      return selectedDoctor && selectedDate && selectedTime;
    }
    if (currentStep === 3) {
      return appointmentDetails.medicalReason && appointmentDetails.phone;
    }
    return true;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Book Appointment
                </h1>
                <p className="text-slate-600">
                  Schedule your appointment with our healthcare professionals
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaCalendarCheck className="text-white text-2xl" />
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step.number
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                      : "bg-slate-200 text-slate-400"
                  }`}>
                    {currentStep > step.number ? (
                      <FaCheckCircle className="text-white" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-semibold text-sm ${
                      currentStep >= step.number ? "text-slate-800" : "text-slate-500"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs ${
                      currentStep >= step.number ? "text-slate-600" : "text-slate-400"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                      currentStep > step.number ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex items-center gap-2">
                {messageType === "success" ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaExclamationTriangle className="text-red-500" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search doctors, specialties, or hospitals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {specialties.map((specialty) => (
                        <button
                          key={specialty.value}
                          onClick={() => setSelectedSpecialty(specialty.value)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            selectedSpecialty === specialty.value
                              ? `bg-gradient-to-r ${specialty.color} text-white shadow-lg`
                              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                          }`}
                        >
                          {specialty.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Doctors List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className={`group cursor-pointer bg-white rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-500 shadow-xl shadow-blue-100"
                          : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200">
                              {doctor.name}
                            </h3>
                            <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty}</p>
                            <p className="text-slate-600 text-sm">{doctor.hospital}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaStar className="text-yellow-400" />
                              <span className="font-semibold text-slate-800">{doctor.rating}</span>
                              <span className="text-slate-500 text-sm">({doctor.reviews} reviews)</span>
                            </div>
                            <span className="text-emerald-600 font-medium text-sm">{doctor.experience}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <FaMapMarkerAlt className="text-slate-400" />
                            <span>{doctor.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <FaPhone className="text-slate-400" />
                            <span>{doctor.phone}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <FaEnvelope className="text-slate-400" />
                            <span className="truncate">{doctor.email}</span>
                          </div>
                        </div>
                        
                        {selectedDoctor?.id === doctor.id && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-700">
                              <FaCheckCircle />
                              <span className="font-medium text-sm">Selected</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-12">
                    <FaExclamationTriangle className="text-4xl text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No doctors found matching your criteria</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Date Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    Select Date
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const isSelected = selectedDate === date.toISOString().split('T')[0];
                      const isToday = i === 0;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                          className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                              : isToday
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xs opacity-75">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-lg font-bold">
                              {date.getDate()}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FaClock className="text-green-500" />
                    Select Time
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {generateTimeSlots().map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedTime === time
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Visit Type Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FaCalendarCheck className="text-purple-500" />
                    Visit Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {visitTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setAppointmentDetails(prev => ({ ...prev, visitType: type.value }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          appointmentDetails.visitType === type.value
                            ? `border-blue-500 bg-gradient-to-r ${type.color} text-white shadow-lg`
                            : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            appointmentDetails.visitType === type.value
                              ? "bg-white/20"
                              : `bg-gradient-to-br ${type.color}`
                          }`}>
                            <type.icon className={`text-lg ${
                              appointmentDetails.visitType === type.value ? "text-white" : "text-white"
                            }`} />
                          </div>
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appointment Details Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FaNotesMedical className="text-orange-500" />
                    Appointment Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Medical Reason *
                      </label>
                      <textarea
                        value={appointmentDetails.medicalReason}
                        onChange={(e) => setAppointmentDetails(prev => ({ ...prev, medicalReason: e.target.value }))}
                        placeholder="Please describe the reason for your visit..."
                        rows="3"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={appointmentDetails.notes}
                        onChange={(e) => setAppointmentDetails(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional information or special requests..."
                        rows="2"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Contact Phone *
                        </label>
                        <input
                          type="tel"
                          value={appointmentDetails.phone}
                          onChange={(e) => setAppointmentDetails(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Your phone number"
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaCheckCircle className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Appointment Confirmed!</h3>
                <p className="text-slate-600 mb-6">
                  Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
                </p>
                
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 max-w-md mx-auto">
                  <h4 className="font-semibold text-slate-800 mb-4">Appointment Summary</h4>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <FaUserMd className="text-blue-500" />
                      <span className="text-sm text-slate-600">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-green-500" />
                      <span className="text-sm text-slate-600">{selectedDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-purple-500" />
                      <span className="text-sm text-slate-600">{selectedTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span className="text-sm text-slate-600">{selectedDoctor?.hospital}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                Previous
              </button>
              
              <button
                onClick={currentStep === 3 ? handleSubmit : handleNext}
                disabled={
                  (currentStep === 1 && !selectedDoctor) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 3 && !appointmentDetails.medicalReason) ||
                  loading
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : currentStep === 3 ? (
                  <>
                    Book Appointment
                    <FaArrowRight />
                  </>
                ) : (
                  <>
                    Next
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
