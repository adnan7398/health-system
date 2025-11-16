import React, { useState, useEffect } from "react";
import DoctorLayout from "./DoctorLayout";
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
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
  
  // Fetch real patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE}/patients`, {
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
    notification.className = "fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50";
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
    <DoctorLayout>
      <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-teal-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaUserMd className="text-teal-600" />
              My Patients
            </h1>
            <button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg" onClick={() => setShowAddForm(true)}>
              <FaUserPlus /> Add New Patient
            </button>
          </div>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                  isFilterOpen 
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white' 
                    : 'bg-teal-100 hover:bg-teal-200 text-teal-700'
                }`}
                onClick={toggleFilterPanel}
              >
                <FaFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-medium transition-all duration-300" onClick={handleClearFilters}>
                Clear All
              </button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="bg-teal-50 rounded-xl p-6 mb-6 border border-teal-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Gender</h3>
                  <select 
                    value={genderFilter} 
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Age Group</h3>
                  <select 
                    value={ageFilter} 
                    onChange={(e) => setAgeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">All Ages</option>
                    <option value="0-18">0-18</option>
                    <option value="0-18">19-40</option>
                    <option value="41-60">41-60</option>
                    <option value="60+">60+</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Sort By</h3>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="name">Name</option>
                    <option value="recent">Recent Visit</option>
                    <option value="newest">Newest Patients</option>
                    <option value="oldest">Oldest Patients</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Summary */}
          <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-teal-800 font-medium">
              Showing {filteredPatients.length} patients {filteredPatients.length !== patients.length && `(filtered from ${patients.length})`}
            </p>
          </div>
          
          {/* Patients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-teal-100 p-6 hover:shadow-xl hover:border-teal-300 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div className="text-4xl">
                      {patient.gender === "Male" ? "👨" : "👩"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800">{patient.firstName} {patient.lastName}</h3>
                      <span className="text-sm text-slate-500">ID: {patient.id}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaVenusMars className="text-blue-500 flex-shrink-0" />
                      <span>{patient.gender}, {patient.age} years</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaTint className="text-red-500 flex-shrink-0" />
                      <span>Blood Group: {patient.bloodGroup || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaPhoneAlt className="text-green-500 flex-shrink-0" />
                      <span>{patient.contact.phone || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaEnvelope className="text-purple-500 flex-shrink-0" />
                      <span>{patient.contact.email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                      <span>{patient.contact.address || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaCalendarAlt className="text-indigo-500 flex-shrink-0" />
                      <span>Last Visit: {patient.recentVisit || "No visits"}</span>
                    </div>
                  </div>
                  
                  {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Medical History</h4>
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalHistory.map((condition, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">{condition}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {patient.appointmentHistory && patient.appointmentHistory.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Upcoming Appointments</h4>
                      <div className="space-y-2">
                        {patient.appointmentHistory
                          .filter(appt => new Date(appt.date) >= new Date() && appt.status === "Scheduled")
                          .slice(0, 2)
                          .map((appt, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <FaCalendarAlt />
                                <span>{appt.date}</span>
                              </div>
                              <div className="text-sm text-blue-600 font-medium">
                                {appt.reason}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300">
                      <FaClipboardList /> View Records
                    </button>
                    <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300">
                      <FaFileMedical /> Add Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <FaUser className="text-6xl text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No patients found</h3>
                <p className="text-slate-500">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
          
          {/* Add Patient Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <FaUserPlus className="text-blue-600" />
                    Add New Patient
                  </h2>
                  <button 
                    className="text-slate-400 hover:text-slate-600 text-2xl transition-colors duration-200" 
                    onClick={() => setShowAddForm(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleAddPatient} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={newPatient.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={newPatient.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="age" className="block text-sm font-medium text-slate-700">Age *</label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={newPatient.age}
                          onChange={handleInputChange}
                          required
                          min="0"
                          max="120"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Gender *</label>
                        <select
                          id="gender"
                          name="gender"
                          value={newPatient.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bloodGroup" className="block text-sm font-medium text-slate-700">Blood Group</label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={newPatient.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                    
                    <div className="space-y-2">
                      <label htmlFor="contact.phone" className="block text-sm font-medium text-slate-700">Phone Number *</label>
                      <input
                        type="tel"
                        id="contact.phone"
                        name="contact.phone"
                        value={newPatient.contact.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="contact.email" className="block text-sm font-medium text-slate-700">Email</label>
                      <input
                        type="email"
                        id="contact.email"
                        name="contact.email"
                        value={newPatient.contact.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="contact.address" className="block text-sm font-medium text-slate-700">Address</label>
                      <textarea
                        id="contact.address"
                        name="contact.address"
                        value={newPatient.contact.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Medical History</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={medicalCondition}
                          onChange={(e) => setMedicalCondition(e.target.value)}
                          placeholder="Add condition"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                        <button 
                          type="button" 
                          onClick={handleAddMedicalCondition}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newPatient.medicalHistory.map((condition, index) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            <span>{condition}</span>
                            <button 
                              type="button"
                              onClick={() => removeMedicalCondition(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                      <button 
                        type="button" 
                        onClick={() => setShowAddForm(false)} 
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <FaUserPlus /> Add Patient
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
    </DoctorLayout>
  );
};

export default PatientsPage;
