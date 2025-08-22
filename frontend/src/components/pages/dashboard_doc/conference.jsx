import React, { useState, useEffect } from "react";
import DoctorSidebar from "./doctorsidebar";
import DatePicker from "react-datepicker"; // Ensure this is correct
import "react-datepicker/dist/react-datepicker.css"; // Ensure the CSS is imported
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFilter,
  FaInfoCircle,
  FaRegCalendarCheck,
  FaPlusCircle,
  FaArrowRight
} from "react-icons/fa";

// Sample conference data
const eventsData = [
  {
    id: 1,
    name: "Annual Medical Conference 2025",
    date: new Date("2025-03-25"),
    time: "10:00 AM - 4:00 PM",
    location: "AIIMS, New Delhi",
    type: "Conference",
    specialty: "General Medicine",
    credits: 10,
    description:
      "A comprehensive discussion on the latest advancements in medicine.",
  },
  {
    id: 2,
    name: "Surgical Innovations Workshop",
    date: new Date("2025-03-27"),
    time: "9:00 AM - 3:00 PM",
    location: "Apollo Hospital, Delhi",
    type: "Workshop",
    specialty: "Surgery",
    credits: 15,
    description: "Hands-on training on the latest surgical techniques.",
  },
  {
    id: 3,
    name: "Cardiology Symposium",
    date: new Date("2025-03-30"),
    time: "11:00 AM - 5:00 PM",
    location: "Fortis Hospital, Gurgaon",
    type: "Symposium",
    specialty: "Cardiology",
    credits: 12,
    description: "Exploring breakthroughs in cardiovascular treatments.",
  },
  {
    id: 4,
    name: "Pediatric Medicine Forum",
    date: new Date("2025-04-03"),
    time: "8:30 AM - 2:00 PM",
    location: "Medanta, Gurgaon",
    type: "Forum",
    specialty: "Pediatrics",
    credits: 8,
    description: "Latest research and treatment approaches in pediatric care.",
  },
  {
    id: 5,
    name: "Telemedicine & AI in Healthcare",
    date: new Date("2025-04-07"),
    time: "10:00 AM - 3:00 PM",
    location: "Max Healthcare, Delhi",
    type: "Conference",
    specialty: "Healthcare Technology",
    credits: 10,
    description: "The role of AI and telemedicine in modern healthcare.",
  },
  {
    id: 6,
    name: "Future of Medical Robotics Summit",
    date: new Date("2025-04-15"),
    time: "9:30 AM - 4:00 PM",
    location: "AIIMS, Delhi",
    type: "Conference",
    specialty: "Robotics",
    credits: 14,
    description:
      "Exploring advancements in robotic surgery and AI-driven healthcare solutions.",
  },
];

const Conferences = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get unique event types and specialties for filters
  const eventTypes = [...new Set(eventsData.map(event => event.type))];
  const specialties = [...new Set(eventsData.map(event => event.specialty))];

  const handleRegister = (event) => {
    if (!registeredEvents.some(e => e.id === event.id)) {
      setRegisteredEvents([...registeredEvents, event]);
      setTotalCredits(totalCredits + event.credits);
      
      // Create notification instead of alert
      const notification = document.createElement("div");
      notification.className = "notification success";
      notification.textContent = `You have registered for: ${event.name}. You earned ${event.credits} CME credits!`;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
  };

  // Filter events based on search term, date range, and filters
  const filteredEvents = eventsData.filter(event => {
    // Search term filter
    const nameMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    const dateMatch = (!startDate || event.date >= startDate) &&
                     (!endDate || event.date <= endDate);
    
    // Type filter
    const typeMatch = !selectedType || event.type === selectedType;
    
    // Specialty filter
    const specialtyMatch = !selectedSpecialty || event.specialty === selectedSpecialty;
    
    return nameMatch && dateMatch && typeMatch && specialtyMatch;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setSelectedType("");
    setSelectedSpecialty("");
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Format date to display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DoctorSidebar />
      <div className="flex-1 ml-64 p-6 transition-all duration-300">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaCalendarAlt className="text-blue-600" />
              Medical Conferences
            </h1>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium">Total CME Credits: </span>
              <span className="text-blue-600 font-bold text-xl">{totalCredits}</span>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button 
              className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                isFilterOpen 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              onClick={toggleFilterPanel}
            >
              <FaFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Date Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs text-slate-600">Start Date</label>
                      <input 
                        type="date" 
                        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs text-slate-600">End Date</label>
                      <input 
                        type="date" 
                        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        min={startDate ? startDate.toISOString().split('T')[0] : ''}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Event Type</h3>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">All Types</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Specialty</h3>
                  <select 
                    value={selectedSpecialty} 
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Results Summary */}
          <div className="results-summary">
            <p>Showing {filteredEvents.length} conferences {filteredEvents.length !== eventsData.length && `(filtered from ${eventsData.length})`}</p>
          </div>
          
          {/* Events Grid */}
          <div className="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card-header">
                    <span className="event-type">{event.type}</span>
                    <span className="event-specialty">{event.specialty}</span>
                  </div>
                  <h2 className="event-title">{event.name}</h2>
                  <div className="event-details">
                    <p className="event-date">
                      <FaCalendarAlt />
                      {formatDate(event.date)}
                    </p>
                    <p className="event-time">
                      <FaClock />
                      {event.time}
                    </p>
                    <p className="event-location">
                      <FaMapMarkerAlt />
                      {event.location}
                    </p>
                    <p className="event-credits">
                      <FaRegCalendarCheck />
                      {event.credits} CME Credits
                    </p>
                  </div>
                  <div className="event-actions">
                    <button
                      className="details-button"
                      onClick={() => handleShowDetails(event)}
                    >
                      <FaInfoCircle /> Details
                    </button>
                    <button
                      className={`register-button ${registeredEvents.some(e => e.id === event.id) ? 'registered' : ''}`}
                      onClick={() => handleRegister(event)}
                      disabled={registeredEvents.some(e => e.id === event.id)}
                    >
                      {registeredEvents.some(e => e.id === event.id) ? (
                        <>Registered <FaRegCalendarCheck /></>
                      ) : (
                        <>Register <FaArrowRight /></>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events-found">
                <FaCalendarAlt className="empty-icon" />
                <h3>No events found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
          
          {/* My Registered Events Section */}
          {registeredEvents.length > 0 && (
            <div className="registered-events-section">
              <h2>My Registered Events</h2>
              <div className="registered-events-list">
                {registeredEvents.map(event => (
                  <div key={event.id} className="registered-event-card">
                    <div className="registered-event-info">
                      <h3>{event.name}</h3>
                      <p>{formatDate(event.date)} | {event.time}</p>
                    </div>
                    <div className="registered-event-credits">
                      {event.credits} Credits
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedEvent(null)}>
              &times;
            </button>
            <div className="modal-header">
              <h2>{selectedEvent.name}</h2>
              <span className="modal-type">{selectedEvent.type} | {selectedEvent.specialty}</span>
            </div>
            <div className="modal-body">
              <div className="modal-detail">
                <FaCalendarAlt />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="modal-detail">
                <FaClock />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="modal-detail">
                <FaMapMarkerAlt />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="modal-detail">
                <FaRegCalendarCheck />
                <span>{selectedEvent.credits} CME Credits</span>
              </div>
              
              <div className="modal-description">
                <h3>Description</h3>
                <p>{selectedEvent.description}</p>
              </div>
              
              {!registeredEvents.some(e => e.id === selectedEvent.id) ? (
                <button 
                  className="modal-register-button"
                  onClick={() => {
                    handleRegister(selectedEvent);
                    setSelectedEvent(null);
                  }}
                >
                  Register for this Event <FaArrowRight />
                </button>
              ) : (
                <button className="modal-registered-button" disabled>
                  Already Registered <FaRegCalendarCheck />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Event Button for admin functionality (can be extended later) */}
      <button className="add-event-button">
        <FaPlusCircle /> Create Conference
      </button>
    </div>
  );
};

export default Conferences;
