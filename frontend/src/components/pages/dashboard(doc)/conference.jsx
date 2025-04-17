import React, { useState } from "react";
import "../css files doc/conference.css";

const eventsData = [
  {
    id: 1,
    name: "Annual Medical Conference 2025",
    date: "March 25, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "AIIMS, New Delhi",
    type: "Conference",
    description:
      "A comprehensive discussion on the latest advancements in medicine.",
  },
  {
    id: 2,
    name: "Surgical Innovations Workshop",
    date: "March 27, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Apollo Hospital, Delhi",
    type: "Workshop",
    description: "Hands-on training on the latest surgical techniques.",
  },
  {
    id: 3,
    name: "Cardiology Symposium",
    date: "March 30, 2025",
    time: "11:00 AM - 5:00 PM",
    location: "Fortis Hospital, Gurgaon",
    type: "Symposium",
    description: "Exploring breakthroughs in cardiovascular treatments.",
  },
  {
    id: 4,
    name: "Pediatric Medicine Forum",
    date: "April 3, 2025",
    time: "8:30 AM - 2:00 PM",
    location: "Medanta, Gurgaon",
    type: "Forum",
    description: "Latest research and treatment approaches in pediatric care.",
  },
  {
    id: 5,
    name: "Telemedicine & AI in Healthcare",
    date: "April 7, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Max Healthcare, Delhi",
    type: "Conference",
    description: "The role of AI and telemedicine in modern healthcare.",
  },
  {
    id: 6,
    name: "Future of Medical Robotics Summit",
    date: "April 15, 2025",
    time: "9:30 AM - 4:00 PM",
    location: "AIIMS, Delhi",
    type: "Conference",
    description:
      "Exploring advancements in robotic surgery and AI-driven healthcare solutions.",
  },
];

const MedicalEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [credits, setCredits] = useState(0);

  const handleRegister = (event) => {
    setCredits(credits + 10);
    alert(
      `You have registered for: ${event.name}\nYou earned 10 CME credits! 🏅`
    );
  };

  return (
    <div className="events-container">
      <h1>Upcoming Medical Events</h1>
      <p>
        Stay updated with the latest medical meetups, conferences, and
        workshops.
      </p>

      <div className="events-list">
        {eventsData.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.name}</h2>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Time:</strong> {event.time}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Type:</strong> {event.type}
            </p>
            <button
              className="register-button"
              onClick={() => handleRegister(event)}
            >
              Get Info
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedEvent(null)}>
              &times;
            </span>
            <h2>{selectedEvent.name}</h2>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedEvent.time}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Type:</strong> {selectedEvent.type}
            </p>
            <p>{selectedEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalEvents;
