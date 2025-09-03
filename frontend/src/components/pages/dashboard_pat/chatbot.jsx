import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaVolumeUp, FaPaperPlane, FaRobot, FaUser, FaSpinner, FaGlobe, FaBrain, FaShieldAlt, FaClock, FaLightbulb, FaHeartbeat, FaStethoscope, FaPills, FaHospital, FaAmbulance, FaNotesMedical, FaDownload, FaShare, FaCog, FaMicrophoneSlash, FaVolumeMute } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Health Assistant. I can help you with health-related questions, symptom analysis, medication information, and general wellness advice. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "welcome"
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
      title: "AI-Powered Analysis",
      description: "Advanced machine learning for accurate health insights",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaShieldAlt,
      title: "Privacy First",
      description: "Your health data is encrypted and secure",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaClock,
      title: "24/7 Availability",
      description: "Get health advice anytime, anywhere",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaLightbulb,
      title: "Smart Recommendations",
      description: "Personalized health tips and suggestions",
      color: "from-orange-500 to-red-500"
    }
  ];

  const healthCategories = [
    { name: "General Health", icon: FaHeartbeat, color: "from-red-500 to-pink-500" },
    { name: "Symptoms", icon: FaStethoscope, color: "from-blue-500 to-cyan-500" },
    { name: "Medications", icon: FaPills, color: "from-green-500 to-emerald-500" },
    { name: "Nutrition", icon: FaHospital, color: "from-purple-500 to-pink-500" },
    { name: "Fitness", icon: FaAmbulance, color: "from-orange-500 to-red-500" },
    { name: "Mental Health", icon: FaNotesMedical, color: "from-indigo-500 to-blue-500" }
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

  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      type: sender === "bot" ? "response" : "user"
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText("");
    addMessage(userMessage, "user");
    setIsLoading(true);

    try {
              const response = await fetch("http://localhost:3000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          language: selectedLanguage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.response, "bot");
        
        // Auto-speak bot response
        if (isSpeaking) {
          speakText(data.response);
        }
      } else {
        addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", "bot");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("I'm sorry, there was an error processing your request. Please try again.", "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      if (messages.length > 1) {
        const lastBotMessage = messages.filter(m => m.sender === "bot").pop();
        if (lastBotMessage) {
          speakText(lastBotMessage.text);
        }
      }
    }
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageCode;
    }
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'AI Assistant'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'health-chat-export.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      if (messages.length > 1) {
        const lastBotMessage = messages.filter(m => m.sender === "bot").pop();
        if (lastBotMessage) {
          speakText(lastBotMessage.text);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaRobot className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Health Assistant
                </h1>
                <p className="text-slate-600">Your 24/7 health companion powered by artificial intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportChat}
                className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                title="Export Chat"
              >
                <FaDownload />
              </button>
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                title="Toggle Features"
              >
                <FaCog />
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaGlobe className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Language:</span>
            </div>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedLanguage === lang.code
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Features Info */}
          {showFeatures && (
            <div className="lg:col-span-1 space-y-6">
              {/* Features */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  Features
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <feature.icon className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Categories */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FaStethoscope className="text-blue-500" />
                  Health Topics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {healthCategories.map((category, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-3 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <category.icon className="text-white text-sm" />
                        </div>
                        <h4 className="font-medium text-slate-800 text-xs">{category.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col ${showFeatures ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                          : "bg-gradient-to-br from-emerald-500 to-green-500"
                      }`}>
                        {message.sender === "user" ? (
                          <FaUser className="text-white text-sm" />
                        ) : (
                          <FaRobot className="text-white text-sm" />
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : "bg-gradient-to-r from-slate-50 to-blue-50 text-slate-800 border border-slate-200"
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-blue-100" : "text-slate-500"
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                        <FaRobot className="text-white text-sm" />
                      </div>
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl px-4 py-3 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaSpinner className="text-blue-600 animate-spin" />
                          <span className="text-slate-600 text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-6">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your health..."
                    className="w-full p-4 pr-12 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows="3"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={toggleSpeaking}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isSpeaking
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title={isSpeaking ? "Stop Speaking" : "Start Speaking"}
                    >
                      <FaVolumeUp className="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                  >
                    <FaMicrophone className="text-lg" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed"
                    title="Send Message"
                  >
                    <FaPaperPlane className="text-lg" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-slate-500 text-center">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
