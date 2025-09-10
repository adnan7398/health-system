import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Home as HomeIcon,
  QrCode,
  Bot,
  Activity,
  FlaskConical,
  Stethoscope,
  User,
  ChevronDown,
  Menu,
  X,
  Heart,
  LogOut,
  Globe,
  ArrowRight,
  Play,
  Clock,
  Users,
  Award,
  Shield,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
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
      icon: Bot,
      title: t('home.features.aiDiagnostics.title', 'AI-Powered Diagnostics'),
      description: t('home.features.aiDiagnostics.description', 'Get instant health insights and preliminary diagnoses powered by advanced artificial intelligence'),
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Clock,
      title: t('home.features.access.title', '24/7 Access'),
      description: t('home.features.access.description', 'Round-the-clock healthcare support and monitoring for your peace of mind'),
      color: "from-emerald-600 to-emerald-700"
    },
    {
      icon: Stethoscope,
      title: t('home.features.expertCare.title', 'Expert Care'),
      description: t('home.features.expertCare.description', 'Connect with qualified healthcare professionals for personalized treatment plans'),
      color: "from-emerald-700 to-emerald-800"
    }
  ];

  const services = [
    { icon: QrCode, title: "Health Card", desc: "Digital health records and QR code access", color: "from-emerald-500 to-emerald-600" },
    { icon: Stethoscope, title: "Health Metrics", desc: "Track vital signs and health indicators", color: "from-emerald-600 to-emerald-700" },
    { icon: Activity, title: "Fitness Plans", desc: "Personalized workout and nutrition plans", color: "from-emerald-700 to-emerald-800" },
    { icon: Bot, title: "Health Assistant", desc: "AI-powered health guidance and support", color: "from-emerald-500 to-emerald-600" },
    { icon: Heart, title: "Respiratory Care", desc: "Specialized breathing and lung health monitoring", color: "from-emerald-600 to-emerald-700" },
    { icon: Heart, title: "Cardiac Care", desc: "Heart health monitoring and prevention", color: "from-emerald-700 to-emerald-800" }
  ];

  if (userStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your healthcare experience...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-emerald-600 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Shield className="w-4 h-4 mr-2" />
                  {t('home.trusted', 'Trusted by 50,000+ users worldwide')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                  {t('home.hero.aiPowered', 'AI-Powered')}
                </span>
                <br />
                <span className="text-gray-800">{t('home.hero.healthcare', 'Healthcare')}</span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-5xl mx-auto leading-relaxed text-gray-600 font-light">
                {t('home.hero.subtitle1', 'Experience healthcare reimagined with cutting-edge AI technology.')} 
                <br className="hidden md:block" />
                <span className="font-medium text-emerald-700">{t('home.hero.subtitle2', 'Faster access, smarter diagnosis, and better lives.')}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <button 
                  onClick={handleGetStarted}
                  className="group px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 flex items-center justify-center space-x-3 hover:from-emerald-700 hover:to-emerald-800"
                >
                  <span>
                    {userStatus.isAuthenticated && userStatus.isHealthCardRegistered 
                      ? t('home.cta.goToDashboard', 'Go to Dashboard')
                      : userStatus.isAuthenticated 
                        ? t('home.cta.goToScanner', 'Go to Scanner (Entry Gate)') 
                        : t('home.cta.startJourney', 'Start Your Journey')
                    }
                  </span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                
                <button 
                  onClick={handleLearnMore}
                  className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-xl transition-all duration-300 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center space-x-3 backdrop-blur-sm"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('home.cta.watchDemo', 'Watch Demo')}</span>
                </button>
              </div>
              
              {/* Health Card Requirement Notice */}
              {userStatus.isAuthenticated && !userStatus.isHealthCardRegistered && (
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg max-w-4xl mx-auto">
                  <div className="flex items-center justify-center text-amber-800">
                    <QrCode className="w-6 h-6 mr-3" />
                    <span className="font-semibold text-lg">
                      {t('home.notice.scannerNext', 'Next Step: Use Scanner as Entry Gate → Complete Health Card Registration (One-time Setup)')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeFeature === index ? 'scale-105' : 'scale-100'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{t('home.stats.title', 'Trusted by Healthcare Leaders')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.stats.subtitle', 'Join thousands of users who rely on our platform for their healthcare needs')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: t('home.stats.activeUsers', 'Active Users'), icon: Users },
              { value: "99.9%", label: t('home.stats.uptime', 'Uptime'), icon: Shield },
              { value: "24/7", label: t('home.stats.support', 'Support'), icon: Clock },
              { value: "5M+", label: t('home.stats.diagnoses', 'Diagnoses'), icon: Award }
            ].map((stat, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-gradient-to-br from-emerald-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-600 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">{t('home.services.title', 'Our Services')}</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t('home.services.subtitle', 'Comprehensive healthcare solutions designed for modern life')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative bg-white p-8 rounded-3xl border-2 border-emerald-100 shadow-xl hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-3">
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t(`home.services.items.${service.title}.title`, service.title)}</h3>
                  <p className="text-gray-600 text-center text-lg leading-relaxed">{t(`home.services.items.${service.title}.desc`, service.desc)}</p>
                  <div className="mt-6 flex justify-center">
                    <ArrowRight className="w-6 h-6 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">{t('home.finalCta.title', 'Ready to Transform Your Healthcare?')}</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
            {t('home.finalCta.subtitle1', 'Join thousands of users who trust Arogyam for their healthcare needs.')} 
            {t('home.finalCta.subtitle2', 'Experience the future of medicine today.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 flex items-center justify-center space-x-3"
            >
              <span>
                {userStatus.isAuthenticated && userStatus.isHealthCardRegistered 
                  ? t('home.cta.goToDashboard', 'Go to Dashboard') 
                  : userStatus.isAuthenticated 
                    ? t('home.cta.goToScanner', 'Go to Scanner (Entry Gate)') 
                    : t('home.finalCta.getStarted', 'Get Started Today')
                }
              </span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <button 
              onClick={handleLearnMore}
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-2xl flex items-center justify-center space-x-3"
            >
              <Play className="w-5 h-5" />
              <span>
                {userStatus.isAuthenticated && userStatus.isHealthCardRegistered 
                  ? t('home.finalCta.viewHealthCard', 'View Health Card') 
                  : userStatus.isAuthenticated 
                    ? t('home.finalCta.learnScanner', 'Learn About Scanner') 
                    : t('home.finalCta.learnMore', 'Learn More')
                }
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Heart className="text-white w-8 h-8" />
                </div>
                <span className="text-3xl font-bold">Arogyam</span>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                Your most trusted healthcare brand, powered by AI technology and designed for modern life.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Facebook, href: "#" }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.href} 
                    className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-emerald-600 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8 text-emerald-400">Product</h4>
              <ul className="space-y-4">
                {["Features", "Integrations", "Pricing", "Changelog", "Documentation"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-lg hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8 text-emerald-400">Company</h4>
              <ul className="space-y-4">
                {["About", "Blog", "Careers", "Press", "Partners"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-lg hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8 text-emerald-400">Support</h4>
              <ul className="space-y-4">
                {["Help Center", "Community", "Contact", "Status", "Security"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-lg hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-12 text-center">
            <p className="text-gray-400 text-lg">
              © 2024 Arogyam. All rights reserved. | 
              <a href="#" className="hover:text-emerald-400 transition-colors duration-200 ml-2">Privacy Policy</a> | 
              <a href="#" className="hover:text-emerald-400 transition-colors duration-200 ml-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Health Card Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="flex items-start space-x-4">
              <QrCode className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2">{t('home.notice.title', 'Complete Your Setup')}</h4>
                <p className="text-sm opacity-90 mb-4">
                  {t('home.notice.body', 'Use the Scanner as your entry gate to complete your Health Card registration.')}
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => window.location.href = "/scanner"}
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('home.notice.ctaScanner', 'Go to Scanner')}
                  </button>
                  <button 
                    onClick={() => setShowNotification(false)}
                    className="text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    {t('home.notice.later', 'Later')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;