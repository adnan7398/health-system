import React, { useState, useEffect } from "react";
import { FaFacebook, FaHeartbeat, FaInstagram, FaLinkedin, FaTwitter, FaStar, FaArrowRight, FaCheckCircle, FaUserMd, FaQrcode, FaRobot, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUsers, FaAward, FaPills, FaFlask, FaStethoscope, FaAmbulance, FaUserFriends, FaLungs, FaThermometerEmpty, FaRunning, FaPlay, FaGithub, FaDribbble, FaBehance } from "react-icons/fa";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FaRobot className="text-4xl" />,
      title: "AI-Powered Diagnostics",
      description: "Get instant health insights and preliminary diagnoses powered by advanced artificial intelligence",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "24/7 Access",
      description: "Round-the-clock healthcare support and monitoring for your peace of mind",
      color: "from-teal-600 to-teal-700"
    },
    {
      icon: <FaUserMd className="text-4xl" />,
      title: "Expert Care",
      description: "Connect with qualified healthcare professionals for personalized treatment plans",
      color: "from-teal-700 to-teal-800"
    }
  ];

  return (
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-teal-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold text-teal-700">
                  Arogyam
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium">Features</a>
                <a href="#services" className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium">Services</a>
                <a href="#about" className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium">About</a>
                <a href="#contact" className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium">Contact</a>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-6 py-2 text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium">
                  Sign In
                </button>
                <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-teal-400 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-teal-600 rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="text-teal-700">
                  AI-Powered
                </span>
                <br />
                <span className="text-gray-800">Healthcare</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-600">
                Experience healthcare reimagined with cutting-edge AI technology. 
                Faster access, smarter diagnosis, and better lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 hover:bg-teal-700">
                  <span>Start Your Journey</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-teal-400 hover:text-teal-600 flex items-center space-x-2">
                  <FaPlay className="text-sm" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
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
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-center">{feature.description}</p>
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
              <div className="text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-teal-700 mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-teal-800 mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                5M+
              </div>
              <div className="text-gray-600 font-medium">Diagnoses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-800 mb-6">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed for modern life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaQrcode, title: "Health Card", desc: "Digital health records and QR code access", color: "from-purple-500 to-pink-500" },
              { icon: FaStethoscope, title: "Health Metrics", desc: "Track vital signs and health indicators", color: "from-blue-500 to-cyan-500" },
              { icon: FaRunning, title: "Fitness Plans", desc: "Personalized workout and nutrition plans", color: "from-emerald-500 to-teal-500" },
              { icon: FaRobot, title: "Health Assistant", desc: "AI-powered health guidance and support", color: "from-orange-500 to-red-500" },
              { icon: FaLungs, title: "Respiratory Care", desc: "Specialized breathing and lung health monitoring", color: "from-indigo-500 to-purple-500" },
              { icon: FaHeartbeat, title: "Cardiac Care", desc: "Heart health monitoring and prevention", color: "from-pink-500 to-rose-500" }
            ].map((service, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                    <service.icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">{service.title}</h3>
                  <p className="text-slate-600 text-center">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-20 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Healthcare?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of users who trust Arogyam for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold">Arogyam</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Your most trusted healthcare brand, powered by AI technology and designed for modern life.
              </p>
              <div className="flex space-x-4">
                {[FaGithub, FaDribbble, FaBehance, FaTwitter].map((Icon, index) => (
                  <a key={index} href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600 transition-all duration-200">
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
                    <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Press", "Partners"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {["Help Center", "Community", "Contact", "Status", "Security"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Arogyam. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
