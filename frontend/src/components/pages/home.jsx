import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaHeartbeat, FaInstagram, FaLinkedin, FaTwitter, FaStar, FaArrowRight, FaCheckCircle, FaShieldAlt, FaUserMd, FaQrcode, FaRobot, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUsers, FaAward, FaGlobe } from "react-icons/fa";

const Home = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClick = () => {
    window.location.href = "/chatbot";
  };

  const stats = [
    { number: "50K+", label: "Patients Served", icon: FaUsers },
    { number: "200+", label: "Expert Doctors", icon: FaUserMd },
    { number: "24/7", label: "Support", icon: FaClock },
    { number: "99.9%", label: "Uptime", icon: FaAward }
  ];

  const featuresData = [
    {
      image: "qrcode.png",
      icon: FaQrcode,
      title: "Digital Health Records",
      description: "Secure, instant access to your complete medical history through QR technology"
    },
    {
      image: "predictive.png",
      icon: FaShieldAlt,
      title: "AI Health Predictions",
      description: "Advanced machine learning algorithms for early disease detection and prevention"
    },
    {
      image: "chatbot.png",
      icon: FaRobot,
      title: "Intelligent Health Assistant",
      description: "24/7 AI-powered medical guidance and symptom analysis"
    },
    {
      image: "datasharing.png",
      icon: FaUserMd,
      title: "Seamless Doctor Communication",
      description: "Direct, secure communication with healthcare providers"
    },
    {
      image: "scheduling.png",
      icon: FaCalendarAlt,
      title: "Smart Appointment Booking",
      description: "Efficient scheduling system with automated reminders"
    },
    {
      image: "sos.png",
      icon: FaHeartbeat,
      title: "Emergency Response",
      description: "Immediate medical assistance and emergency protocols"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      feedback: "Arogyam has revolutionized how we manage patient care. The seamless integration of health records and AI diagnostics has improved our diagnostic accuracy by 40%.",
      rating: 5,
      role: "Cardiologist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Michael Chen",
      feedback: "The platform's predictive analytics have been invaluable in early disease detection. It's like having a second opinion that never sleeps.",
      rating: 5,
      role: "Neurologist",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Emily Rodriguez",
      feedback: "Patient engagement has increased significantly since implementing Arogyam. The QR-based system makes information sharing instant and secure.",
      rating: 5,
      role: "Pediatrician",
      avatar: "https://images.unsplash.com/photo-1594824475544-3d9c2c3c3c3c?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const services = [
    {
      title: "Primary Care",
      description: "Comprehensive health assessments and preventive care",
      icon: FaUserMd
    },
    {
      title: "Specialized Treatment",
      description: "Expert care across all medical specialties",
      icon: FaHeartbeat
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency medical services",
      icon: FaClock
    },
    {
      title: "Telemedicine",
      description: "Virtual consultations from anywhere",
      icon: FaGlobe
    }
  ];

  return (
    <div className="min-h-screen bg-white">


      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-zinc-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-slate-100 text-slate-700 px-6 py-3 rounded-full text-sm font-semibold border border-slate-200">
                <FaCheckCircle className="text-slate-600" />
                Trusted by 500+ Healthcare Providers
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Advanced Healthcare
                <span className="text-slate-700 block">Technology</span>
                for Modern Medicine
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                Arogyam combines cutting-edge AI, secure health records, and seamless doctor-patient communication to deliver superior healthcare outcomes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#features" 
                  className="inline-flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Explore Features
                  <FaArrowRight className="text-sm" />
                </a>
                
                <button 
                  onClick={handleClick}
                  className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FaRobot className="text-sm" />
                  Try AI Assistant
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
                <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-zinc-100 rounded-2xl flex items-center justify-center">
                  <FaHeartbeat className="text-7xl text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 p-4 border border-slate-200">
                  <stat.icon className="w-8 h-8 text-slate-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Advanced Healthcare Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover how our integrated platform transforms healthcare delivery through innovative technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-slate-200"
              >
                <div className="w-16 h-16 mb-6 rounded-xl bg-slate-100 p-4 border border-slate-200">
                  <feature.icon className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Comprehensive Medical Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From primary care to specialized treatments, we provide comprehensive healthcare solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-slate-100 p-5 group-hover:bg-slate-200 transition-colors border border-slate-200">
                  <service.icon className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what medical experts say about Arogyam's impact on healthcare delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "{testimonial.feedback}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-slate-200 mb-8">
            Join thousands of healthcare providers and patients who trust Arogyam for their medical needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
            >
              Get Started Today
              <FaArrowRight className="text-sm" />
            </a>
            <a 
              href="/chatbot" 
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-slate-700 text-white border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
            >
              <FaRobot className="text-sm" />
              Try AI Assistant
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold">Arogyam</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Advancing healthcare through innovative technology and AI-powered solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#testimonials" className="text-slate-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="/signup" className="text-slate-400 hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/chatbot" className="text-slate-400 hover:text-white transition-colors">AI Assistant</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <FaPhone className="text-slate-300" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <FaEnvelope className="text-slate-300" />
                  <span>info@arogyam.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <FaMapMarkerAlt className="text-slate-300" />
                  <span>123 Medical Center Dr, Healthcare City</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © 2024 Arogyam. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <FaLinkedin className="text-xl" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
