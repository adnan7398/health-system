import React, { useState, useEffect } from 'react';
import { FaDumbbell, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaTicketAlt, FaUsers, FaPlay, FaTimes, FaHeart, FaRunning, FaLeaf, FaBrain } from 'react-icons/fa';

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
            currentParticipants: 15,
            type: "yoga",
            icon: FaLeaf
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
            currentParticipants: 10,
            type: "workout",
            icon: FaRunning
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
            currentParticipants: 18,
            type: "meditation",
            icon: FaBrain
        },
        {
            id: 4,
            title: "Strength Training",
            description: "Build muscle and improve your overall strength with guided weight training.",
            date: "2024-03-23",
            time: "06:30 AM",
            credits: 20,
            location: "Gym Studio",
            instructor: "Alex Rodriguez",
            maxParticipants: 12,
            currentParticipants: 8,
            type: "strength",
            icon: FaDumbbell
        },
        {
            id: 5,
            title: "Cardio Dance",
            description: "Fun and energetic dance workout to get your heart pumping and burn calories.",
            date: "2024-03-24",
            time: "04:00 PM",
            credits: 12,
            location: "Dance Studio",
            instructor: "Emma Wilson",
            maxParticipants: 30,
            currentParticipants: 22,
            type: "dance",
            icon: FaRunning
        },
        {
            id: 6,
            title: "Pilates Session",
            description: "Core-focused workout to improve posture, flexibility, and body awareness.",
            date: "2024-03-25",
            time: "08:00 AM",
            credits: 8,
            location: "Pilates Studio",
            instructor: "David Kim",
            maxParticipants: 18,
            currentParticipants: 12,
            type: "pilates",
            icon: FaLeaf
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

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'yoga': return 'from-teal-500 to-teal-600';
            case 'workout': return 'from-teal-500 to-teal-600';
            case 'meditation': return 'from-teal-500 to-teal-600';
            case 'strength': return 'from-teal-500 to-teal-600';
            case 'dance': return 'from-teal-500 to-teal-600';
            case 'pilates': return 'from-teal-500 to-teal-600';
            default: return 'from-teal-500 to-teal-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Credits Display */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitness & Wellness</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join fitness events and earn wellness credits
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaTicketAlt className="text-2xl text-teal-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Available Credits</h2>
                        </div>
                        <p className="text-4xl font-bold text-teal-600">{credits}</p>
                        <p className="text-gray-600 mt-2">Use your credits to join fitness events</p>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Fitness Events</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose from a variety of fitness activities and wellness sessions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div 
                                key={event.id} 
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => handleEventClick(event)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${getEventTypeColor(event.type)} rounded-lg flex items-center justify-center`}>
                                        <event.icon className="text-white text-xl" />
                                    </div>
                                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                                        {event.credits} credits
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaCalendarAlt className="text-teal-500" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaClock className="text-teal-500" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaMapMarkerAlt className="text-teal-500" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaUser className="text-teal-500" />
                                        <span>{event.instructor}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaUsers className="text-teal-500" />
                                        <span>{event.currentParticipants}/{event.maxParticipants}</span>
                                    </div>
                                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2">
                                        <FaPlay className="text-xs" />
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-16 h-16 bg-gradient-to-br ${getEventTypeColor(selectedEvent.type)} rounded-2xl flex items-center justify-center`}>
                                    <selectedEvent.icon className="text-white text-2xl" />
                                </div>
                                <button 
                                    onClick={handleCloseModal}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                                >
                                    <FaTimes className="text-gray-600" />
                                </button>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>
                            <p className="text-gray-600 text-lg mb-6">{selectedEvent.description}</p>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FaCalendarAlt className="text-teal-600 text-lg" />
                                        <span className="text-gray-700"><strong>Date:</strong> {selectedEvent.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-teal-600 text-lg" />
                                        <span className="text-gray-700"><strong>Time:</strong> {selectedEvent.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaMapMarkerAlt className="text-teal-600 text-lg" />
                                        <span className="text-gray-700"><strong>Location:</strong> {selectedEvent.location}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FaUser className="text-teal-600 text-lg" />
                                        <span className="text-gray-700"><strong>Instructor:</strong> {selectedEvent.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaTicketAlt className="text-teal-600 text-lg" />
                                        <span className="text-gray-700"><strong>Credits:</strong> {selectedEvent.credits}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaUsers className="text-teal-600 text-lg" />
                                        <span className="text-gray-700"><strong>Participants:</strong> {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleRegister(selectedEvent)}
                                    disabled={credits < selectedEvent.credits}
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <FaHeart />
                                    Register for Event
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>

                            {credits < selectedEvent.credits && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm text-center">
                                        Not enough credits to register for this event. You need {selectedEvent.credits} credits.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-teal-700 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Fit?</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                        Join our fitness community and start your wellness journey today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/userdashboard" className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg">
                            Back to Dashboard
                        </a>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300">
                            View All Events
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Fitness;
