import React, { useState } from "react";
import "../css files patient/fitness.css";

const eventsData = [
  {
    id: 1,
    name: "Decathlon Fitness Fest 2025",
    date: "March 25, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "Decathlon Sports Arena, New Delhi",
    type: "Fitness Festival",
    description:
      "A full-day event featuring fitness challenges, expert talks, and hands-on workshops with Decathlon trainers.",
  },
  {
    id: 2,
    name: "Run for Health: Decathlon Marathon",
    date: "March 27, 2025",
    time: "6:00 AM - 12:00 PM",
    location: "Lodhi Garden, Delhi",
    type: "Marathon",
    description:
      "Join us for a 10K and half-marathon run, powered by Decathlon, promoting fitness and healthy living.",
  },
  {
    id: 3,
    name: "Strength & Conditioning Workshop",
    date: "March 30, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Decathlon Training Center, Gurgaon",
    type: "Workshop",
    description:
      "A hands-on session with professional trainers focusing on endurance, strength-building, and injury prevention.",
  },
  {
    id: 4,
    name: "Cycling for a Cause",
    date: "April 3, 2025",
    time: "5:30 AM - 10:00 AM",
    location: "India Gate to Gurgaon",
    type: "Cycling Event",
    description:
      "An exciting cycling event organized by Decathlon to promote fitness and sustainability.",
  },
  {
    id: 5,
    name: "Yoga & Mindfulness Retreat",
    date: "April 7, 2025",
    time: "7:00 AM - 12:00 PM",
    location: "Decathlon Community Park, Delhi",
    type: "Wellness Event",
    description:
      "A rejuvenating yoga and meditation session led by top wellness experts to promote mental and physical well-being.",
  },
  {
    id: 6,
    name: "Functional Training Bootcamp",
    date: "April 10, 2025",
    time: "6:30 AM - 11:00 AM",
    location: "Decathlon Fitness Zone, Noida",
    type: "Bootcamp",
    description:
      "An intensive outdoor training session focusing on agility, mobility, and strength-building exercises led by Decathlon fitness experts.",
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
      <h1>Exciting Upcoming Events</h1>
      <p>Stay updated with the latest activities and workshops.</p>

      <div className="credits-display">
        <strong className="credits-text">
          🏅 CME Credits Earned: {credits}
        </strong>
      </div>

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
              Register
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
