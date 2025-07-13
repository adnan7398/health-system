import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css files patient/bookappoinment.css";
import Userdashboardsidebar from "./userdashboardsidebar";

const BookAppointment = () => {
  // State variables
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [medicalReason, setMedicalReason] = useState("");
  const [notes, setNotes] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isLoading, setIsLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date/Time, 3: Confirmation
  const [specializationFilter, setSpecializationFilter] = useState("");
  
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];


  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/doctor");
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        
        // Extract unique specializations
        const uniqueSpecializations = [...new Set(response.data.map(doctor => doctor.specialization))];
        setSpecializations(uniqueSpecializations);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setMessage("Failed to fetch doctors. Please try again later.");
        setMessageType("error");
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors when specialization changes
  useEffect(() => {
    if (specializationFilter) {
      const filtered = doctors.filter(doctor => doctor.specialization === specializationFilter);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [specializationFilter, doctors]);

  // Fetch available time slots when doctor and date change
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from backend if it exists
      try {
        const response = await axios.get(`http://localhost:3000/doctor-availability?doctorId=${selectedDoctor}&date=${selectedDate}`);
        
        if (response.data.available) {
          setAvailableTimeSlots(response.data.availableTimeSlots);
          setMessage("");
        } else {
          throw new Error("No available slots from server");
        }
      } catch (error) {
        // If backend endpoint fails, generate default time slots
        // Generate time slots from 9 AM to 5 PM with 30-minute intervals
        const generatedTimeSlots = [];
        const selectedDateObj = new Date(selectedDate);
        const dayOfWeek = selectedDateObj.getDay();
        
        // Don't generate slots for Sundays (0) or Saturdays (6)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Default time slots from 9 AM to 5 PM with 30-minute intervals
          for (let hour = 9; hour < 17; hour++) {
            generatedTimeSlots.push(`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`);
            generatedTimeSlots.push(`${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`);
          }
        }
        
        if (generatedTimeSlots.length > 0) {
          setAvailableTimeSlots(generatedTimeSlots);
          setMessage("");
        } else {
          setAvailableTimeSlots([]);
          setMessage("No available appointments on weekends. Please select a weekday.");
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Error handling time slots:", error);
      setAvailableTimeSlots([]);
      setMessage("Could not determine available time slots. Please try a different date.");
      setMessageType("error");
    }
    setIsLoading(false);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedTime("");
    setAvailableTimeSlots([]);
    setStep(1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const handleSpecializationChange = (e) => {
    setSpecializationFilter(e.target.value);
    setSelectedDoctor("");
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const validateStep1 = () => {
    if (!selectedDoctor) {
      setMessage("Please select a doctor");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!selectedDate) {
      setMessage("Please select a date");
      setMessageType("error");
      return false;
    }
    if (!selectedTime) {
      setMessage("Please select a time slot");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!medicalReason) {
      setMessage("Please provide a reason for the appointment");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setMessage("");
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setMessage("");
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        medicalReason,
        notes,
        patientPhone,
        isFirstVisit
      };
      
      const response = await axios.post(
        "http://localhost:3000/book-appointment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAppointment(response.data.appointment);
      setMessage("Appointment booked successfully!");
      setMessageType("success");
      
      // Clear form
      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedTime("");
      setMedicalReason("");
      setNotes("");
      setStep(1);
      
    } catch (error) {
      console.error("Error booking appointment:", error);
      setMessage(error.response?.data?.message || "Failed to book appointment. Please try again.");
      setMessageType("error");
    }
    
    setIsLoading(false);
  };

  // Find selected doctor object
  const selectedDoctorObj = doctors.find(doctor => doctor._id === selectedDoctor);

  return (
    <div className="appointment-container">
      <div className="sidebar">
        <Userdashboardsidebar />
      </div>
      
      <div className="appointment-content">
        <div className="appointment-header">
          <h1>Book an Appointment</h1>
          <p>Schedule an appointment with our healthcare professionals</p>
        </div>
        
        {appointment && (
          <div className="appointment-success">
            <div className="success-icon">✓</div>
            <h2>Appointment Confirmed!</h2>
            <div className="appointment-details">
              <div className="appointment-info-grid">
                <p><strong>Doctor:</strong> {appointment.doctor}</p>
                <p><strong>Specialization:</strong> {appointment.specialization}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                <p><strong>Key:</strong> {appointment.authKey}</p>
              </div>
              <p className="note">Please keep this authentication key for your records.</p>
            </div>
            <div className="appointment-buttons">
              <button className="primary-button" onClick={() => setAppointment(null)}>Book Another</button>
              <button className="secondary-button" onClick={() => navigate("/patientappointments")}>View Appointments</button>
            </div>
          </div>
        )}
        
        {!appointment && (
          <div className="appointment-form-container">
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-title">Select Doctor</div>
              </div>
              <div className="step-divider"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-title">Schedule</div>
              </div>
              <div className="step-divider"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-title">Details</div>
              </div>
            </div>
            
            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Doctor */}
              {step === 1 && (
                <div className="form-step">
                  <div className="form-group">
                    <label>Filter by Specialization</label>
                    <select 
                      value={specializationFilter} 
                      onChange={handleSpecializationChange}
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Select Doctor</label>
                    <select
                      value={selectedDoctor}
                      onChange={handleDoctorChange}
                      required
                    >
                      <option value="">-- Select a Doctor --</option>
                      {filteredDoctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedDoctorObj && (
                    <div className="doctor-card">
                      <div className="doctor-info">
                        <h3>Dr. {selectedDoctorObj.firstName} {selectedDoctorObj.lastName}</h3>
                        <p className="doctor-specialization">{selectedDoctorObj.specialization}</p>
                        <p><i className="hospital-icon"></i> {selectedDoctorObj.hospital}</p>
                        <p>{selectedDoctorObj.experience} Years Experience</p>
                        <p className="doctor-bio">{selectedDoctorObj.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 2: Select Date and Time */}
              {step === 2 && (
                <div className="form-step">
                  <div className="form-group">
                    <label>Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={today}
                      required
                    />
                  </div>
                  
                  {selectedDate && (
                    <div className="form-group">
                      <label>Select Time Slot</label>
                      {isLoading ? (
                        <div className="loading-spinner"></div>
                      ) : availableTimeSlots.length > 0 ? (
                        <div className="time-slots">
                          {availableTimeSlots.map((time, index) => (
                            <div
                              key={index}
                              className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                              onClick={() => handleTimeChange(time)}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-slots">No available time slots for the selected date.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 3: Additional Details */}
              {step === 3 && (
                <div className="form-step">
                  <div className="form-group">
                    <label>Reason for Visit <span className="required">*</span></label>
                    <select
                      value={medicalReason}
                      onChange={(e) => setMedicalReason(e.target.value)}
                      required
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="General Checkup">General Checkup</option>
                      <option value="Follow-up Visit">Follow-up Visit</option>
                      <option value="New Symptoms">New Symptoms</option>
                      <option value="Chronic Condition">Chronic Condition</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Medical Test Results">Medical Test Results</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Please provide any additional information about your condition"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="Your contact number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={isFirstVisit}
                        onChange={(e) => setIsFirstVisit(e.target.checked)}
                      />
                      This is my first visit with this doctor
                    </label>
                  </div>
                  
                  <div className="appointment-summary">
                    <h3>Appointment Summary</h3>
                    <p><strong>Doctor:</strong> Dr. {selectedDoctorObj?.firstName} {selectedDoctorObj?.lastName}</p>
                    <p><strong>Specialization:</strong> {selectedDoctorObj?.specialization}</p>
                    <p><strong>Hospital:</strong> {selectedDoctorObj?.hospital}</p>
                    <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                  </div>
                </div>
              )}
              
              <div className="form-buttons">
                {step > 1 && (
                  <button 
                    type="button" 
                    className="secondary-button" 
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button 
                    type="button" 
                    className="primary-button" 
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Booking...' : 'Confirm Appointment'}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
