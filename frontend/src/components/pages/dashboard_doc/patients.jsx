import React, { useState, useEffect } from "react";
import "../css files doc/patients.css";
import DoctorSidebar from "./doctorsidebar";
import { 
  FaUser, 
  FaUserPlus, 
  FaSearch, 
  FaFilter, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTimes,
  FaUserMd,
  FaVenusMars,
  FaTint,
  FaClipboardList,
  FaEdit,
  FaFileMedical
} from "react-icons/fa";

// Dummy patient data
const dummyPatients = [
  {
    id: 1,
    firstName: "Rajiv",
    lastName: "Sharma",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: {
      phone: "+91 9876543210",
      email: "rajiv.sharma@example.com",
      address: "123 Gandhi Road, New Delhi"
    },
    medicalHistory: ["Hypertension", "Type 2 Diabetes"],
    appointmentHistory: [
      { date: "2023-12-15", reason: "Annual Checkup", status: "Completed" },
      { date: "2024-03-10", reason: "Follow-up", status: "Scheduled" }
    ],
    registrationDate: "2023-05-20",
    recentVisit: "2023-12-15"
  },
  {
    id: 2,
    firstName: "Priya",
    lastName: "Patel",
    age: 32,
    gender: "Female",
    bloodGroup: "B+",
    contact: {
      phone: "+91 8765432109",
      email: "priya.patel@example.com",
      address: "456 Nehru Street, Mumbai"
    },
    medicalHistory: ["Asthma"],
    appointmentHistory: [
      { date: "2024-01-05", reason: "Respiratory Issues", status: "Completed" },
      { date: "2024-04-15", reason: "Follow-up", status: "Scheduled" }
    ],
    registrationDate: "2023-08-12",
    recentVisit: "2024-01-05"
  },
  {
    id: 3,
    firstName: "Amit",
    lastName: "Singh",
    age: 38,
    gender: "Male",
    bloodGroup: "A-",
    contact: {
      phone: "+91 7654321098",
      email: "amit.singh@example.com",
      address: "789 Tagore Lane, Bangalore"
    },
    medicalHistory: ["Chronic Back Pain"],
    appointmentHistory: [
      { date: "2023-11-20", reason: "Pain Management", status: "Completed" },
      { date: "2024-02-05", reason: "Follow-up", status: "Completed" }
    ],
    registrationDate: "2023-06-15",
    recentVisit: "2024-02-05"
  },
  {
    id: 4,
    firstName: "Meena",
    lastName: "Gupta",
    age: 52,
    gender: "Female",
    bloodGroup: "AB+",
    contact: {
      phone: "+91 6543210987",
      email: "meena.gupta@example.com",
      address: "234 Bose Road, Kolkata"
    },
    medicalHistory: ["Hypothyroidism", "Arthritis"],
    appointmentHistory: [
      { date: "2024-01-18", reason: "Joint Pain", status: "Completed" }
    ],
    registrationDate: "2023-09-05",
    recentVisit: "2024-01-18"
  },
  {
    id: 5,
    firstName: "Sanjay",
    lastName: "Kumar",
    age: 41,
    gender: "Male",
    bloodGroup: "O-",
    contact: {
      phone: "+91 5432109876",
      email: "sanjay.kumar@example.com",
      address: "567 Ambedkar Colony, Chennai"
    },
    medicalHistory: ["High Cholesterol"],
    appointmentHistory: [
      { date: "2023-10-12", reason: "Routine Checkup", status: "Completed" },
      { date: "2024-05-20", reason: "Follow-up", status: "Scheduled" }
    ],
    registrationDate: "2023-04-10",
    recentVisit: "2023-10-12"
  },
  {
    id: 6,
    firstName: "Ananya",
    lastName: "Reddy",
    age: 28,
    gender: "Female",
    bloodGroup: "B-",
    contact: {
      phone: "+91 4321098765",
      email: "ananya.reddy@example.com",
      address: "890 Patel Nagar, Hyderabad"
    },
    medicalHistory: ["Migraine"],
    appointmentHistory: [
      { date: "2024-02-22", reason: "Severe Headache", status: "Completed" }
    ],
    registrationDate: "2023-11-08",
    recentVisit: "2024-02-22"
  }
];

const PatientsPage = () => {
  const [patients, setPatients] = useState(dummyPatients);
  const [filteredPatients, setFilteredPatients] = useState(dummyPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [apiPatients, setApiPatients] = useState([]);
  const token = localStorage.getItem("doctorToken");
  
  // Fetch real patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setApiPatients(data);
        } else if (Array.isArray(data.patients)) {
          setApiPatients(data.patients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [token]);

  // Combine dummy and API patients, with API patients taking precedence
  useEffect(() => {
    if (apiPatients.length > 0) {
      const combinedPatients = [...dummyPatients];
      
      apiPatients.forEach(apiPatient => {
        // Format the API patient to match our structure
        const formattedPatient = {
          id: apiPatient._id,
          firstName: apiPatient.firstName || "",
          lastName: apiPatient.lastName || "",
          age: apiPatient.age || "",
          gender: apiPatient.gender || "Male",
          bloodGroup: apiPatient.bloodGroup || "",
          contact: {
            phone: apiPatient.contact?.phone || "",
            email: apiPatient.contact?.email || "",
            address: apiPatient.contact?.address || ""
          },
          medicalHistory: apiPatient.medicalHistory || [],
          appointmentHistory: apiPatient.appointmentHistory || [],
          registrationDate: apiPatient.registrationDate || new Date().toISOString().split('T')[0],
          recentVisit: apiPatient.recentVisit || new Date().toISOString().split('T')[0]
        };
        
        // Add to combined patients list
        combinedPatients.push(formattedPatient);
      });
      
      setPatients(combinedPatients);
      setFilteredPatients(combinedPatients);
    }
  }, [apiPatients]);
  
  // Form state
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "Male",
    bloodGroup: "",
    contact: {
      phone: "",
      email: "",
      address: ""
    },
    medicalHistory: []
  });

  const [medicalCondition, setMedicalCondition] = useState("");

  // Filter patients when search term or filters change
  useEffect(() => {
    let result = patients;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(patient => 
        patient.firstName.toLowerCase().includes(term) || 
        patient.lastName.toLowerCase().includes(term) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term) ||
        patient.contact.email.toLowerCase().includes(term) ||
        patient.contact.phone.includes(term)
      );
    }
    
    // Gender filter
    if (genderFilter) {
      result = result.filter(patient => patient.gender === genderFilter);
    }
    
    // Age filter
    if (ageFilter) {
      if (ageFilter === "0-18") {
        result = result.filter(patient => patient.age <= 18);
      } else if (ageFilter === "19-40") {
        result = result.filter(patient => patient.age > 18 && patient.age <= 40);
      } else if (ageFilter === "41-60") {
        result = result.filter(patient => patient.age > 40 && patient.age <= 60);
      } else if (ageFilter === "60+") {
        result = result.filter(patient => patient.age > 60);
      }
    }
    
    // Sort results
    if (sortBy === "name") {
      result = [...result].sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    } else if (sortBy === "recent") {
      result = [...result].sort((a, b) => new Date(b.recentVisit) - new Date(a.recentVisit));
    } else if (sortBy === "oldest") {
      result = [...result].sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate));
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    }
    
    setFilteredPatients(result);
  }, [patients, searchTerm, genderFilter, ageFilter, sortBy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewPatient({
        ...newPatient,
        [parent]: {
          ...newPatient[parent],
          [child]: value
        }
      });
    } else {
      setNewPatient({
        ...newPatient,
        [name]: value
      });
    }
  };

  const handleAddMedicalCondition = () => {
    if (medicalCondition.trim()) {
      setNewPatient({
        ...newPatient,
        medicalHistory: [...newPatient.medicalHistory, medicalCondition.trim()]
      });
      setMedicalCondition("");
    }
  };

  const removeMedicalCondition = (index) => {
    const updatedHistory = [...newPatient.medicalHistory];
    updatedHistory.splice(index, 1);
    setNewPatient({
      ...newPatient,
      medicalHistory: updatedHistory
    });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.age || !newPatient.contact.phone) {
      alert("Please fill in all required fields");
      return;
    }
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create new patient with ID and dates
    const patientToAdd = {
      ...newPatient,
      id: patients.length + 1,
      registrationDate: currentDate,
      recentVisit: currentDate,
      appointmentHistory: []
    };
    
    // Add to patients list
    setPatients([...patients, patientToAdd]);
    
    // Reset form
    setNewPatient({
      firstName: "",
      lastName: "",
      age: "",
      gender: "Male",
      bloodGroup: "",
      contact: {
        phone: "",
        email: "",
        address: ""
      },
      medicalHistory: []
    });
    
    // Close form
    setShowAddForm(false);
    
    // Show success message
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.textContent = `Patient ${patientToAdd.firstName} ${patientToAdd.lastName} has been added successfully!`;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setGenderFilter("");
    setAgeFilter("");
    setSortBy("name");
  };

  return (
    <div className="doctor-dashboard">
      <DoctorSidebar />
      <div className="dashboard-content">
        <div className="patients-page">
          {/* Header Section */}
          <div className="patients-header">
            <h1><FaUserMd /> My Patients</h1>
            <button className="add-patient-btn" onClick={() => setShowAddForm(true)}>
              <FaUserPlus /> Add New Patient
            </button>
          </div>
          
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <button 
              className={`filter-button ${isFilterOpen ? 'active' : ''}`}
              onClick={toggleFilterPanel}
            >
              <FaFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="filter-panel">
              <div className="filter-section">
                <h3>Gender</h3>
                <select 
                  value={genderFilter} 
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="filter-section">
                <h3>Age Group</h3>
                <select 
                  value={ageFilter} 
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Ages</option>
                  <option value="0-18">0-18</option>
                  <option value="19-40">19-40</option>
                  <option value="41-60">41-60</option>
                  <option value="60+">60+</option>
                </select>
              </div>
              
              <div className="filter-section">
                <h3>Sort By</h3>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Name</option>
                  <option value="recent">Recent Visit</option>
                  <option value="newest">Newest Patients</option>
                  <option value="oldest">Oldest Patients</option>
                </select>
              </div>
              
              <button 
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
          
          {/* Results Summary */}
          <div className="results-summary">
            <p>Showing {filteredPatients.length} patients {filteredPatients.length !== patients.length && `(filtered from ${patients.length})`}</p>
          </div>
          
          {/* Patients Grid */}
          <div className="patients-grid">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-card-header">
                    <div className="patient-avatar">
                      {patient.gender === "Male" ? "👨" : "👩"}
                    </div>
                    <div className="patient-name">
                      <h3>{patient.firstName} {patient.lastName}</h3>
                      <span className="patient-id">ID: {patient.id}</span>
                    </div>
                  </div>
                  
                  <div className="patient-info">
                    <div className="info-item">
                      <FaVenusMars />
                      <span>{patient.gender}, {patient.age} years</span>
                    </div>
                    <div className="info-item">
                      <FaTint />
                      <span>Blood Group: {patient.bloodGroup || "Not specified"}</span>
                    </div>
                    <div className="info-item">
                      <FaPhoneAlt />
                      <span>{patient.contact.phone || "Not provided"}</span>
                    </div>
                    <div className="info-item">
                      <FaEnvelope />
                      <span>{patient.contact.email || "Not provided"}</span>
                    </div>
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <span>{patient.contact.address || "Not provided"}</span>
                    </div>
                    <div className="info-item">
                      <FaCalendarAlt />
                      <span>Last Visit: {patient.recentVisit || "No visits"}</span>
                    </div>
                  </div>
                  
                  {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                    <div className="medical-history">
                      <h4>Medical History</h4>
                      <div className="conditions-list">
                        {patient.medicalHistory.map((condition, index) => (
                          <span key={index} className="condition-tag">{condition}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {patient.appointmentHistory && patient.appointmentHistory.length > 0 && (
                    <div className="appointment-history">
                      <h4>Upcoming Appointments</h4>
                      <div className="appointment-list">
                        {patient.appointmentHistory
                          .filter(appt => new Date(appt.date) >= new Date() && appt.status === "Scheduled")
                          .slice(0, 2)
                          .map((appt, index) => (
                            <div key={index} className="appointment-item">
                              <div className="appointment-date">
                                <FaCalendarAlt />
                                <span>{appt.date}</span>
                              </div>
                              <div className="appointment-reason">
                                {appt.reason}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  <div className="patient-actions">
                    <button className="view-history-btn">
                      <FaClipboardList /> View Records
                    </button>
                    <button className="add-appt-btn">
                      <FaFileMedical /> Add Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-patients-found">
                <FaUser className="empty-icon" />
                <h3>No patients found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
          
          {/* Add Patient Modal */}
          {showAddForm && (
            <div className="modal">
              <div className="modal-content">
                <button className="close-button" onClick={() => setShowAddForm(false)}>
                  <FaTimes />
                </button>
                <div className="modal-header">
                  <h2><FaUserPlus /> Add New Patient</h2>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddPatient}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={newPatient.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={newPatient.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="age">Age *</label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={newPatient.age}
                          onChange={handleInputChange}
                          required
                          min="0"
                          max="120"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="gender">Gender *</label>
                        <select
                          id="gender"
                          name="gender"
                          value={newPatient.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="bloodGroup">Blood Group</label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={newPatient.bloodGroup}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="contact.phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="contact.phone"
                        name="contact.phone"
                        value={newPatient.contact.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="contact.email">Email</label>
                      <input
                        type="email"
                        id="contact.email"
                        name="contact.email"
                        value={newPatient.contact.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="contact.address">Address</label>
                      <textarea
                        id="contact.address"
                        name="contact.address"
                        value={newPatient.contact.address}
                        onChange={handleInputChange}
                        rows="2"
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label>Medical History</label>
                      <div className="medical-history-input">
                        <input
                          type="text"
                          value={medicalCondition}
                          onChange={(e) => setMedicalCondition(e.target.value)}
                          placeholder="Add condition"
                        />
                        <button 
                          type="button" 
                          onClick={handleAddMedicalCondition}
                          className="add-condition-btn"
                        >
                          Add
                        </button>
                      </div>
                      <div className="conditions-list">
                        {newPatient.medicalHistory.map((condition, index) => (
                          <div key={index} className="condition-tag">
                            {condition}
                            <button 
                              type="button"
                              onClick={() => removeMedicalCondition(index)}
                              className="remove-condition-btn"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                        Cancel
                      </button>
                      <button type="submit" className="submit-btn">
                        <FaUserPlus /> Add Patient
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
