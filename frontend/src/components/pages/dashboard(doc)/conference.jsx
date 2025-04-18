import React, { useState, useEffect } from "react";
import DoctorSidebar from "./doctorsidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css files doc/conference.css";
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
    <div className="doctor-dashboard">
      <DoctorSidebar />
      <div className="dashboard-content">
        <div className="conferences-page">
          {/* Header Section */}
          <div className="conferences-header">
            <h1><FaCalendarAlt /> Medical Conferences</h1>
            <div className="cme-credits-counter">
              <span>Total CME Credits: </span>
              <span className="credits-value">{totalCredits}</span>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name or location..."
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
                <h3>Date Range</h3>
                <div className="date-filters">
                  <div className="date-picker-container">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                      className="date-picker"
                    />
                  </div>
                  <div className="date-picker-container">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                      className="date-picker"
                      min={startDate ? startDate.toISOString().split('T')[0] : ''}
                    />
                  </div>
                </div>
              </div>
              
              <div className="filter-section">
                <h3>Event Type</h3>
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-section">
                <h3>Specialty</h3>
                <select 
                  value={selectedSpecialty} 
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
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
