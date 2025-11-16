import React, { useState, useEffect } from "react";
import DoctorLayout from "./DoctorLayout";
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
    <DoctorLayout>
      <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-teal-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
              <FaCalendarAlt className="text-teal-600" />
              Medical Conferences
            </h1>
            <div className="bg-teal-50 px-4 py-2 rounded-lg border border-teal-200">
              <span className="text-teal-800 font-medium">Total CME Credits: </span>
              <span className="text-teal-600 font-bold text-xl">{totalCredits}</span>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
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
          </div>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="bg-teal-50 rounded-xl p-6 mb-6 border border-teal-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-teal-800 uppercase tracking-wider mb-3">Date Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs text-teal-700 font-medium">Start Date</label>
                      <input 
                        type="date" 
                        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs text-teal-700 font-medium">End Date</label>
                      <input 
                        type="date" 
                        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                        min={startDate ? startDate.toISOString().split('T')[0] : ''}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-teal-800 uppercase tracking-wider mb-3">Event Type</h3>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white"
                  >
                    <option value="">All Types</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-teal-800 uppercase tracking-wider mb-3">Specialty</h3>
                  <select 
                    value={selectedSpecialty} 
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white"
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
          <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-teal-800 font-medium">
              Showing {filteredEvents.length} conferences {filteredEvents.length !== eventsData.length && `(filtered from ${eventsData.length})`}
            </p>
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-teal-100 p-6 hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full whitespace-nowrap">{event.type}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap ml-2">{event.specialty}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 min-h-[3rem]">{event.name}</h2>
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaCalendarAlt className="text-teal-500 flex-shrink-0 w-4" />
                      <span className="truncate">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaClock className="text-emerald-500 flex-shrink-0 w-4" />
                      <span className="truncate">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-teal-500 flex-shrink-0 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaRegCalendarCheck className="text-emerald-500 flex-shrink-0 w-4" />
                      <span className="truncate">{event.credits} CME Credits</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <button
                      className="flex-1 bg-teal-100 hover:bg-teal-200 text-teal-700 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300"
                      onClick={() => handleShowDetails(event)}
                    >
                      <FaInfoCircle /> Details
                    </button>
                    <button
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                        registeredEvents.some(e => e.id === event.id)
                          ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white'
                      }`}
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
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <FaCalendarAlt className="text-6xl text-teal-300 mb-4" />
                <h3 className="text-xl font-semibold text-teal-700 mb-2">No events found</h3>
                <p className="text-teal-600">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
          
          {/* My Registered Events Section */}
          {registeredEvents.length > 0 && (
            <div className="bg-teal-50 rounded-xl p-6 border border-teal-200 mt-8">
              <h2 className="text-xl font-semibold text-teal-800 mb-4 flex items-center gap-2">
                <FaRegCalendarCheck className="text-teal-600" />
                My Registered Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-lg p-4 border border-teal-200 hover:border-teal-300 transition-all duration-300">
                    <div className="mb-3">
                      <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">{event.name}</h3>
                      <p className="text-sm text-slate-600">{formatDate(event.date)} | {event.time}</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium text-center">
                      {event.credits} Credits
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start p-6 border-b border-teal-200">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-3">{selectedEvent.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                    {selectedEvent.type}
                  </span>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    {selectedEvent.specialty}
                  </span>
                </div>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-600 text-2xl transition-colors duration-200 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100" 
                onClick={() => setSelectedEvent(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <FaCalendarAlt className="text-teal-500 flex-shrink-0 w-5" />
                  <span className="text-sm">{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <FaClock className="text-emerald-500 flex-shrink-0 w-5" />
                  <span className="text-sm">{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <FaMapMarkerAlt className="text-teal-500 flex-shrink-0 w-5" />
                  <span className="text-sm">{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <FaRegCalendarCheck className="text-emerald-500 flex-shrink-0 w-5" />
                  <span className="text-sm">{selectedEvent.credits} CME Credits</span>
                </div>
              </div>
              
              <div className="border-t border-teal-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Description</h3>
                <p className="text-slate-600 leading-relaxed">{selectedEvent.description}</p>
              </div>
              
              <div className="border-t border-teal-200 pt-6">
                {!registeredEvents.some(e => e.id === selectedEvent.id) ? (
                  <button 
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                    onClick={() => {
                      handleRegister(selectedEvent);
                      setSelectedEvent(null);
                    }}
                  >
                    Register for this Event <FaArrowRight />
                  </button>
                ) : (
                  <button className="w-full bg-emerald-100 text-emerald-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed" disabled>
                    Already Registered <FaRegCalendarCheck />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default Conferences;
