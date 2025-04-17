import React, { useState, useEffect } from 'react';
import "../css files patient/fitness.css";
const Fitness = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [credits, setCredits] = useState(100);
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Morning Yoga Session",
            description: "Start your day with a refreshing yoga session. Perfect for all levels.",
            date: "2024-03-20",
            time: "06:00 AM",
            credits: 10,
            location: "Central Park",
            instructor: "Sarah Johnson",
            maxParticipants: 20,
            currentParticipants: 15
        },
        {
            id: 2,
            title: "HIIT Workout",
            description: "High-intensity interval training to boost your metabolism and burn calories.",
            date: "2024-03-21",
            time: "05:00 PM",
            credits: 15,
            location: "Fitness Center",
            instructor: "Mike Thompson",
            maxParticipants: 15,
            currentParticipants: 10
        },
        {
            id: 3,
            title: "Meditation Class",
            description: "Learn mindfulness techniques to reduce stress and improve focus.",
            date: "2024-03-22",
            time: "07:00 PM",
            credits: 5,
            location: "Wellness Studio",
            instructor: "Lisa Chen",
            maxParticipants: 25,
            currentParticipants: 18
        }
    ]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleRegister = (event) => {
        if (credits >= event.credits) {
            setCredits(credits - event.credits);
            const updatedEvents = events.map(e => {
                if (e.id === event.id) {
                    return { ...e, currentParticipants: e.currentParticipants + 1 };
                }
                return e;
            });
            setEvents(updatedEvents);
            handleCloseModal();
        } else {
            alert("Not enough credits to register for this event!");
        }
    };

    return (
        <div className="events-container">
            <h1>Fitness Events</h1>
            <p>Join our community events and stay active!</p>
            
            <div className="credits-display">
                <span className="credits-text">Available Credits: {credits}</span>
            </div>

            <div className="events-list">
                {events.map(event => (
                    <div 
                        key={event.id} 
                        className="event-card"
                        onClick={() => handleEventClick(event)}
                    >
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <p>📅 {event.date}</p>
                        <p>⏰ {event.time}</p>
                        <p>📍 {event.location}</p>
                        <p>👤 {event.instructor}</p>
                        <p>🎫 {event.credits} credits</p>
                        <p>👥 {event.currentParticipants}/{event.maxParticipants} participants</p>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>{selectedEvent.title}</h2>
                        <p>{selectedEvent.description}</p>
                        <p>📅 Date: {selectedEvent.date}</p>
                        <p>⏰ Time: {selectedEvent.time}</p>
                        <p>📍 Location: {selectedEvent.location}</p>
                        <p>👤 Instructor: {selectedEvent.instructor}</p>
                        <p>🎫 Credits Required: {selectedEvent.credits}</p>
                        <p>👥 Available Spots: {selectedEvent.maxParticipants - selectedEvent.currentParticipants}</p>
                        <button 
                            className="register-button"
                            onClick={() => handleRegister(selectedEvent)}
                            disabled={credits < selectedEvent.credits || selectedEvent.currentParticipants >= selectedEvent.maxParticipants}
                        >
                            <span>Register Now</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fitness;
