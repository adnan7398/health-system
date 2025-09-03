import React from "react";
import { FaFacebook, FaHeartbeat, FaInstagram, FaLinkedin, FaTwitter, FaStar, FaArrowRight, FaCheckCircle, FaUserMd, FaQrcode, FaRobot, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUsers, FaAward, FaPills, FaFlask, FaStethoscope, FaAmbulance, FaUserFriends, FaLungs, FaThermometerEmpty, FaRunning } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700/80 to-teal-800/80 z-20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            AI-Powered Healthcare: Faster Access, Smarter Diagnosis, Better Lives!
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
            Arogyam harnesses the power of AI to provide instant medical access, smart diagnostics, and real-time health monitoring.
          </p>
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Explore Features
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Arogyam?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare reimagined with cutting-edge AI technology and personalized care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRobot className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Diagnostics</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant health insights and preliminary diagnoses powered by advanced artificial intelligence
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaClock className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock healthcare support and monitoring for your peace of mind
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserMd className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Care</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with qualified healthcare professionals for personalized treatment plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed for modern life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-teal-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Card</h3>
              <p className="text-sm text-gray-600">Digital health records and QR code access</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-teal-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaStethoscope className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Metrics</h3>
              <p className="text-sm text-gray-600">Track vital signs and health indicators</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-teal-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaRunning className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitness Plans</h3>
              <p className="text-sm text-gray-600">Personalized workout and nutrition plans</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-teal-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaRobot className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Assistant</h3>
              <p className="text-sm text-gray-600">AI-powered health guidance and support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of users who trust Arogyam for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold">Arogyam</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Your most trusted healthcare brand, powered by AI technology
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                  <FaLinkedin className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Doctors</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Health Monitoring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">AI Diagnostics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Telemedicine</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Health Records</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-teal-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-teal-400" />
                  <span className="text-gray-400">info@arogyam.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-teal-400" />
                  <span className="text-gray-400">Healthcare District, City</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Arogyam. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
