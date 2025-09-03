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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaRobot className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
              AI Health Assistant
            </h1>
            <p className="text-slate-600 text-lg">Your 24/7 health companion powered by artificial intelligence</p>
          </div>
          
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={toggleVoiceInput}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white'
              }`}
            >
              {isListening ? <FaMicrophoneSlash className="mr-2" /> : <FaMicrophone className="mr-2" />}
              {isListening ? 'Stop Listening' : 'Voice Input'}
            </button>
            
            <button
              onClick={toggleVoiceOutput}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isSpeaking
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white'
              }`}
            >
              {isSpeaking ? <FaVolumeMute className="mr-2" /> : <FaVolumeUp className="mr-2" />}
              {isSpeaking ? 'Mute' : 'Voice Output'}
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Messages */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Chat Conversation</h2>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-slate-600">AI Online</span>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto mb-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white'
                        : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200 px-4 py-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin text-slate-600" />
                      <span className="text-sm text-slate-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about your health..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isLoading}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
          </div>

          {/* Features Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Features</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FaMicrophone className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Voice Input</h4>
                  <p className="text-xs text-slate-600">Speak naturally to ask questions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <FaVolumeUp className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Voice Output</h4>
                  <p className="text-xs text-slate-600">Listen to AI responses</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaBrain className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">AI Powered</h4>
                  <p className="text-xs text-slate-600">Advanced health insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Privacy Safe</h4>
                  <p className="text-xs text-slate-600">Your data is protected</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-800 text-sm mb-2">Quick Tips</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Ask about symptoms and conditions</li>
                <li>• Get medication information</li>
                <li>• Learn about preventive care</li>
                <li>• Understand test results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
