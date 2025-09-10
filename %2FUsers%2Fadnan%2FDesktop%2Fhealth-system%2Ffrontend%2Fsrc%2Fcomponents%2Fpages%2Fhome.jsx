import React, { useState, useEffect } from "react";
import { FaFacebook, FaHeartbeat, FaInstagram, FaLinkedin, FaTwitter, FaStar, FaArrowRight, FaCheckCircle, FaUserMd, FaQrcode, FaRobot, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUsers, FaAward, FaPills, FaFlask, FaStethoscope, FaAmbulance, FaUserFriends, FaLungs, FaThermometerEmpty, FaRunning, FaPlay, FaGithub, FaDribbble, FaBehance } from "react-icons/fa";
import HealthCardNotification from "../utils/HealthCardNotification";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    isHealthCardRegistered: false,
    isLoading: true
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);

    checkUserStatus();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userStatus.isAuthenticated && !userStatus.isHealthCardRegistered && !userStatus.isLoading) {
      setShowNotification(true);
    }
  }, [userStatus]);

  const checkUserStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserStatus({
          isAuthenticated: false,
          isHealthCardRegistered: false,
          isLoading: false
        });
        return;
      }

      const response = await fetch("https://arogyam-15io.onrender.com/health-card-status", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserStatus({
          isAuthenticated: true,
          isHealthCardRegistered: data.isHealthCardRegistered || false,
          isLoading: false
        });
      } else {
        localStorage.removeItem("token");
        setUserStatus({
          isAuthenticated: false,
          isHealthCardRegistered: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      setUserStatus({
        isAuthenticated: false,
        isHealthCardRegistered: false,
        isLoading: false
      });
    }
  };

  const handleGetStarted = () => {
    if (!userStatus.isAuthenticated) {
      window.location.href = "/signin";
    } else if (!userStatus.isHealthCardRegistered) {
      window.location.href = "/scanner";
    } else {
      window.location.href = "/userdashboard";
    }
  };

  const handleLearnMore = () => {
    if (userStatus.isAuthenticated && userStatus.isHealthCardRegistered) {
      window.location.href = "/userdashboard";
    } else if (userStatus.isAuthenticated) {
      window.location.href = "/scanner";
    } else {
      window.location.href = "/signin";
    }
  };

  const features = [
    {
      icon: <FaRobot className="text-4xl" />,
      title: "AI-Powered Diagnostics",
      description: "Get instant health insights and preliminary diagnoses powered by advanced artificial intelligence",
      color: "from-lime-500 to-green-600"
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "24/7 Access",
      description: "Round-the-clock healthcare support and monitoring for your peace of mind",
      color: "from-green-600 to-emerald-700"
    },
    {
      icon: <FaUserMd className="text-4xl" />,
      title: "Expert Care",
      description: "Connect with qualified healthcare professionals for personalized treatment plans",
      color: "from-emerald-700 to-green-800"
    }
  ];

  if (userStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-green-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-green-50 to-green-100"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-lime-400 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-emerald-600 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left mb-16 md:mb-0">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                  <img src="/logo1.svg" alt="Arogyam" className="h-10 w-10" />
                  <span className="text-2xl font-bold text-gray-900">Arogyam</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                  <span className="text-lime-700">Intelligent</span>{' '}
                  <span className="text-gray-900">Healthcare Platform</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl md:max-w-3xl md:mx-0 mx-auto leading-relaxed text-gray-600">
                  Trusted, doctor-grade AI assistance with secure digital health identity. Scan once, access all facilities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                  <button
                    onClick={handleGetStarted}
                    className="group px-8 py-4 bg-lime-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 hover:bg-lime-700"
                  >
                    <span>
                      {userStatus.isAuthenticated && userStatus.isHealthCardRegistered
                        ? "Go to Dashboard"
                        : userStatus.isAuthenticated
                          ? "Go to Scanner (Entry Gate)"
                          : "Start Your Journey"}
                    </span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  <button
                    onClick={handleLearnMore}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-lime-400 hover:text-lime-600 flex items-center space-x-2"
                  >
                    <FaPlay className="text-sm" />
                    <span>Watch Demo</span>
                  </button>
                </div>

                {userStatus.isAuthenticated && !userStatus.isHealthCardRegistered && (
                  <div className="mt-6 p-4 bg-lime-50 border border-lime-200 rounded-lg">
                    <div className="flex items-center justify-center md:justify-start text-lime-800">
                      <FaQrcode className="text-xl mr-2" />
                      <span className="font-medium">
                        Next Step: Use Scanner as Entry Gate → Complete Health Card Registration (One-time Setup)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-lime-300 rounded-3xl blur-2xl opacity-50"></div>
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-green-400 rounded-3xl blur-2xl opacity-50"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/40 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {[{icon: FaStethoscope, title: 'Doctor-Grade', desc: 'Clinical quality AI'}, {icon: FaShieldAlt, title: 'Secure', desc: 'Encrypted health ID'}, {icon: FaRobot, title: 'AI Assistant', desc: '24/7 guidance'}, {icon: FaQrcode, title: 'One Scan', desc: 'Access all facilities'}].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-600 text-white rounded-xl flex items-center justify-center mb-3">
                        <item.icon className="text-lg" />
                      </div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeFeature === index ? 'scale-105' : 'scale-100'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-lime-600 mb-2 group-hover:scale-110 transition-transform duration-300">50K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-700 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-emerald-800 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-lime-600 mb-2 group-hover:scale-110 transition-transform duration-300">5M+</div>
              <div className="text-gray-600 font-medium">Diagnoses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-gradient-to-br from-lime-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive healthcare solutions designed for modern life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaQrcode, title: "Health Card", desc: "Digital health records and QR code access", color: "from-lime-500 to-green-600" },
              { icon: FaStethoscope, title: "Health Metrics", desc: "Track vital signs and health indicators", color: "from-green-600 to-emerald-700" },
              { icon: FaRunning, title: "Fitness Plans", desc: "Personalized workout and nutrition plans", color: "from-emerald-700 to-green-800" },
              { icon: FaRobot, title: "Health Assistant", desc: "AI-powered health guidance and support", color: "from-lime-500 to-green-600" },
              { icon: FaLungs, title: "Respiratory Care", desc: "Specialized breathing and lung health monitoring", color: "from-green-600 to-emerald-700" },
              { icon: FaHeartbeat, title: "Cardiac Care", desc: "Heart health monitoring and prevention", color: "from-emerald-700 to-green-800" }
            ].map((service, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative bg-white p-8 rounded-2xl border border-lime-200 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                    <service.icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{service.title}</h3>
                  <p className="text-gray-600 text-center">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-lime-600 via-green-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Healthcare?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">Join thousands who trust Arogyam for their healthcare needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-lime-700 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {userStatus.isAuthenticated && userStatus.isHealthCardRegistered
                ? "Go to Dashboard"
                : userStatus.isAuthenticated
                  ? "Go to Scanner (Entry Gate)"
                  : "Get Started Today"}
            </button>
            <button
              onClick={handleLearnMore}
              className="border-2 border-white text-white hover:bg-white hover:text-lime-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              {userStatus.isAuthenticated && userStatus.isHealthCardRegistered
                ? "View Health Card"
                : userStatus.isAuthenticated
                  ? "Learn About Scanner"
                  : "Learn More"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-600 to-green-700 rounded-xl flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold">Arogyam</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Your most trusted healthcare brand, powered by AI technology and designed for modern life.</p>
              <div className="flex space-x-4">
                {[FaGithub, FaDribbble, FaBehance, FaTwitter].map((Icon, index) => (
                  <a key={index} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-lime-600 transition-all duration-200">
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {["Features", "Integrations", "Pricing", "Changelog", "Documentation"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Press", "Partners"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {["Help Center", "Community", "Contact", "Status", "Security"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2024 Arogyam. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {showNotification && (
        <HealthCardNotification
          type="warning"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Home;
