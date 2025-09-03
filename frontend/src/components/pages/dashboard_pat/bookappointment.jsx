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
    { value: "all", label: "All Specialties", color: "from-teal-500 to-teal-600" },
    { value: "cardiology", label: "Cardiology", color: "from-teal-500 to-teal-600" },
    { value: "neurology", label: "Neurology", color: "from-teal-500 to-teal-600" },
    { value: "orthopedics", label: "Orthopedics", color: "from-teal-500 to-teal-600" },
    { value: "dermatology", label: "Dermatology", color: "from-teal-500 to-teal-600" },
    { value: "pediatrics", label: "Pediatrics", color: "from-teal-500 to-teal-600" },
    { value: "psychiatry", label: "Psychiatry", color: "from-teal-500 to-teal-600" }
  ];

  const visitTypes = [
    { value: "in-person", label: "In-Person Visit", icon: FaUser, color: "from-teal-500 to-teal-600" },
    { value: "video", label: "Video Consultation", icon: FaPhone, color: "from-teal-500 to-teal-600" },
    { value: "phone", label: "Phone Consultation", icon: FaPhone, color: "from-teal-500 to-teal-600" }
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
          email: "sarah.wilson@medical.com",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
          availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
          languages: ["English", "Spanish"],
          education: "Harvard Medical School",
          certifications: ["Board Certified Cardiologist", "Fellowship in Interventional Cardiology"]
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
          email: "michael.chen@medical.com",
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
          availableSlots: ["11:00 AM", "01:00 PM", "04:00 PM"],
          languages: ["English", "Mandarin"],
          education: "Stanford Medical School",
          certifications: ["Board Certified Neurologist", "Fellowship in Movement Disorders"]
        },
        {
          id: 3,
          name: "Dr. Emily Rodriguez",
          specialty: "Pediatrics",
          hospital: "Children's Medical Center",
          experience: "8 years",
          rating: 4.7,
          reviews: 156,
          location: "Family Care Complex",
          phone: "+1 (555) 345-6789",
          email: "emily.rodriguez@medical.com",
          image: "https://images.unsplash.com/photo-1594824475544-3d9c2c3c3c3c?w=150&h=150&fit=crop&crop=face",
          availableSlots: ["08:00 AM", "09:00 AM", "03:00 PM", "04:00 PM"],
          languages: ["English", "Spanish"],
          education: "UCLA Medical School",
          certifications: ["Board Certified Pediatrician", "Fellowship in Pediatric Emergency Medicine"]
        }
      ];
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
    };

    fetchDoctors();
  }, []);

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
    if (specialty === "all") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor => 
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
      );
      setFilteredDoctors(filtered);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(term.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(term.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setMessage("Please complete all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Appointment booked successfully! You will receive a confirmation email shortly.");
      setMessageType("success");
      setLoading(false);
      setCurrentStep(4);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <FaCalendarCheck className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Schedule consultations with top healthcare professionals in just a few clicks
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold text-lg ${
                  currentStep >= step.number
                    ? "bg-teal-600 border-teal-600 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}>
                  {currentStep > step.number ? <FaCheckCircle className="text-white" /> : step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? "bg-teal-600" : "bg-gray-300"
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Search and Filters */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search doctors by name, specialty, or hospital..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty.value}
                        onClick={() => handleSpecialtyChange(specialty.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                          selectedSpecialty === specialty.value
                            ? "bg-teal-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {specialty.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading doctors...</p>
                    </div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-8">
                      <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No doctors found matching your criteria</p>
                    </div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => handleDoctorSelect(doctor)}
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-teal-300"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-teal-200"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                                <p className="text-teal-600 font-medium mb-1">{doctor.specialty}</p>
                                <p className="text-gray-600 text-sm">{doctor.hospital}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  <FaStar className="text-yellow-400" />
                                  <span className="font-semibold text-gray-900">{doctor.rating}</span>
                                </div>
                                <p className="text-sm text-gray-600">{doctor.reviews} reviews</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaClock className="text-teal-500" />
                                <span>{doctor.experience} experience</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-teal-500" />
                                <span>{doctor.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Date</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const isToday = i === 0;
                      const isSelected = selectedDate === date.toISOString().split('T')[0];
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? "bg-teal-600 text-white shadow-lg"
                              : isToday
                              ? "bg-teal-100 text-teal-700 border-2 border-teal-300"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Time</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedDoctor?.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedTime === slot
                            ? "bg-teal-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedDate || !selectedTime}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Details</h2>
              
              <div className="space-y-6">
                {/* Visit Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Type</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {visitTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setAppointmentDetails(prev => ({ ...prev, visitType: type.value }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          appointmentDetails.visitType === type.value
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <type.icon className={`text-2xl mx-auto mb-2 ${
                          appointmentDetails.visitType === type.value ? "text-teal-600" : "text-gray-500"
                        }`} />
                        <p className="font-medium text-gray-900">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medical Reason */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Medical Reason
                  </label>
                  <textarea
                    name="medicalReason"
                    value={appointmentDetails.medicalReason}
                    onChange={handleInputChange}
                    placeholder="Please describe the reason for your visit..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={appointmentDetails.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={appointmentDetails.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Booking...
                    </div>
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-4xl text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Your appointment has been successfully booked. You will receive a confirmation email shortly.
              </p>

              {/* Appointment Summary */}
              <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 capitalize">{appointmentDetails.visitType}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Book Another Appointment
                </button>
                <a
                  href="/userdashboard"
                  className="px-8 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white rounded-lg font-medium transition-all duration-200"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookAppointment;
