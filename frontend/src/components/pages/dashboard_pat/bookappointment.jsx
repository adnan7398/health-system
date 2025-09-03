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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaCalendarCheck className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
              Book Your Appointment
            </h1>
            <p className="text-slate-600 text-lg">Schedule a consultation with our healthcare professionals</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > step.number ? <FaCheckCircle className="text-white" /> : step.number}
                </div>
                <div className="ml-4 mr-8">
                  <h3 className="font-semibold text-slate-800">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 rounded-full ${
                    currentStep > step.number ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Select Your Doctor</h2>
              
              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  {specialties.map((specialty) => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctors Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <FaSpinner className="text-4xl text-slate-400 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-600">Loading doctors...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedDoctor?.id === doctor.id
                          ? 'border-slate-600 shadow-xl'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                          />
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">{doctor.name}</h3>
                            <p className="text-slate-600">{doctor.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <FaStar className="text-yellow-500 text-sm" />
                              <span className="text-slate-700 font-medium">{doctor.rating}</span>
                              <span className="text-slate-500 text-sm">({doctor.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaHospital className="text-slate-400" />
                            {doctor.hospital}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaStethoscope className="text-slate-400" />
                            {doctor.experience} experience
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaMapMarkerAlt className="text-slate-400" />
                            {doctor.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          {doctor.languages.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                              {lang}
                            </span>
                          ))}
                        </div>

                        <div className="text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoctor(doctor);
                            }}
                            className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200"
                          >
                            Select Doctor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Choose Date & Time</h2>
              
              {selectedDoctor ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Select Date</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Select Time</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedDoctor.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            selectedTime === slot
                              ? 'border-slate-600 bg-slate-50 text-slate-800'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaExclamationTriangle className="text-4xl text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Please select a doctor first</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Appointment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Medical Reason</label>
                  <textarea
                    value={appointmentDetails.medicalReason}
                    onChange={(e) => setAppointmentDetails({...appointmentDetails, medicalReason: e.target.value})}
                    placeholder="Describe your symptoms or reason for visit..."
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                  <textarea
                    value={appointmentDetails.notes}
                    onChange={(e) => setAppointmentDetails({...appointmentDetails, notes: e.target.value})}
                    placeholder="Any additional information..."
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={appointmentDetails.phone}
                    onChange={(e) => setAppointmentDetails({...appointmentDetails, phone: e.target.value})}
                    placeholder="Your contact number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Visit Type</label>
                  <div className="space-y-3">
                    {visitTypes.map((type) => (
                      <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visitType"
                          value={type.value}
                          checked={appointmentDetails.visitType === type.value}
                          onChange={(e) => setAppointmentDetails({...appointmentDetails, visitType: e.target.value})}
                          className="w-4 h-4 text-slate-600 focus:ring-slate-500"
                        />
                        <div className={`w-8 h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center`}>
                          <type.icon className="text-white text-sm" />
                        </div>
                        <span className="text-slate-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Confirm Appointment</h2>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Appointment Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Doctor Information</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-medium">Name:</span> {selectedDoctor?.name}</p>
                      <p><span className="font-medium">Specialty:</span> {selectedDoctor?.specialty}</p>
                      <p><span className="font-medium">Hospital:</span> {selectedDoctor?.hospital}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Appointment Details</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-medium">Date:</span> {selectedDate}</p>
                      <p><span className="font-medium">Time:</span> {selectedTime}</p>
                      <p><span className="font-medium">Type:</span> {appointmentDetails.visitType}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-2">Medical Information</h4>
                  <p className="text-sm text-slate-600 mb-2"><span className="font-medium">Reason:</span> {appointmentDetails.medicalReason}</p>
                  {appointmentDetails.notes && (
                    <p className="text-sm text-slate-600"><span className="font-medium">Notes:</span> {appointmentDetails.notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                Confirm Appointment
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 ${
            messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
