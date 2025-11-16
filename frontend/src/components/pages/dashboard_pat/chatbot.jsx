import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaVolumeUp, FaPaperPlane, FaRobot, FaUser, FaSpinner, FaGlobe, FaBrain, FaShieldAlt, FaClock, FaLightbulb, FaHeartbeat, FaStethoscope, FaPills, FaHospital, FaAmbulance, FaNotesMedical, FaDownload, FaShare, FaCog, FaMicrophoneSlash, FaVolumeMute, FaArrowRight, FaLungs } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! 🙏 I'm your Desi Remedies Assistant. I can help you with traditional Indian/Pakistani household remedies for common health issues like cold, cough, stomach problems, skin issues, and more. Remember, these are traditional cultural practices, not medical treatments. For emergencies or serious symptoms, always seek medical help immediately. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "welcome",
      intensity: "mild"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "zh", name: "中文", flag: "🇨🇳" }
  ];

  const features = [
    {
      icon: FaBrain,
      title: "Traditional Remedies",
      description: "Authentic Indian/Pakistani household remedies passed down through generations",
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: FaShieldAlt,
      title: "Safety First",
      description: "Automatic safety warnings for emergencies and serious conditions",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: FaClock,
      title: "24/7 Availability",
      description: "Get traditional remedy advice anytime, anywhere",
      color: "from-teal-500 to-emerald-600"
    },
    {
      icon: FaLightbulb,
      title: "Cultural Wisdom",
      description: "Time-tested remedies for common health issues",
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const healthCategories = [
    { name: "Cold & Cough", icon: FaLungs, color: "from-blue-500 to-cyan-600", query: "cold and cough" },
    { name: "Stomach Issues", icon: FaStethoscope, color: "from-green-500 to-emerald-600", query: "acidity" },
    { name: "Skin Problems", icon: FaHospital, color: "from-pink-500 to-rose-600", query: "acne" },
    { name: "Headache", icon: FaBrain, color: "from-purple-500 to-indigo-600", query: "headache" },
    { name: "Pain Relief", icon: FaHeartbeat, color: "from-red-500 to-orange-600", query: "joint pain" },
    { name: "Digestion", icon: FaPills, color: "from-amber-500 to-yellow-600", query: "indigestion" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addMessage("I'm sorry, I couldn't understand that. Could you please try again?", "bot");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text, sender, intensity = "mild") => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      intensity
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    addMessage(userMessage, "user");
    setInputText("");
    setIsLoading(true);
    setShowFeatures(false);

    try {
      const response = await fetch("http://127.0.0.1:5001/desiremedy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.response || "Thank you for your message. I'm here to help!", "bot", data.intensity || "mild");
      } else {
        const errorData = await response.json().catch(() => ({}));
        addMessage(errorData.error || "I'm sorry, I'm experiencing some technical difficulties. Please try again later.", "bot", "mild");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "I'm sorry, I'm experiencing some technical difficulties. ";
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMessage += "Please make sure the backend server is running on http://127.0.0.1:5001";
      } else {
        errorMessage += "Please try again later.";
      }
      addMessage(errorMessage, "bot", "mild");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (query) => {
    setInputText(query);
    // Optionally auto-send
    // handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleSpeechSynthesis = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1]?.text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const changeLanguage = (langCode) => {
    setSelectedLanguage(langCode);
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Desi Remedies Assistant Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional Indian/Pakistani household remedies for common health issues
            </p>
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-amber-800">
                ⚠️ <strong>Important:</strong> These are traditional cultural practices, not medical treatments. 
                For emergencies or serious symptoms, always seek immediate medical help.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-3xl text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore different areas of health and wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.query)}
                className="bg-gray-50 p-6 rounded-xl text-center hover:bg-orange-50 transition-all duration-300 border border-gray-200 hover:border-orange-300 hover:shadow-md transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">Click to ask about remedies</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ask About Traditional Remedies</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ask about common health issues like cold, cough, stomach problems, skin issues, etc.
            </p>
          </div>

          {/* Language Selector */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaGlobe className="text-teal-600 text-xl" />
              <span className="text-gray-700 font-medium">Select Language:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaRobot className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Desi Remedies Assistant</h3>
                  <p className="text-teal-100 text-sm">Online • Traditional remedies</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeechSynthesis}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isSpeaking ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  title={isSpeaking ? "Stop speaking" : "Listen to response"}
                >
                  {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isListening ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-teal-600 text-white rounded-br-md"
                        : message.intensity === "emergency"
                        ? "bg-red-50 text-red-900 rounded-bl-md shadow-md border-2 border-red-300"
                        : message.intensity === "moderate"
                        ? "bg-amber-50 text-amber-900 rounded-bl-md shadow-md border border-amber-200"
                        : "bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    {message.intensity === "emergency" && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 font-semibold">
                        🚨 Emergency - Seek immediate medical help
                      </div>
                    )}
                    <p className={`text-xs mt-2 ${
                      message.sender === "user" ? "text-teal-100" : "text-gray-500"
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-md border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin text-teal-600" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about traditional remedies (e.g., 'cold and cough', 'acidity', 'headache')..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  <FaPaperPlane className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Need More Help?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Our Desi Remedies assistant provides traditional household remedies. For medical diagnosis or treatment, please consult healthcare professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/bookappointment" className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg">
              Book Appointment
            </a>
            <a href="/userdashboard" className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300">
              Back to Dashboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chatbot;
