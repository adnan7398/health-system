import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  UserCheck,
  Heart,
  Activity,
  Clock,
  User,
  Thermometer,
  Droplets,
  Weight,
  Brain,
  Zap,
  QrCode,
  Bot,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Stethoscope,
  FlaskConical
} from 'lucide-react';

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  const [currentTime, setCurrentTime] = useState("");

  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "Confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "2024-01-22",
      time: "2:00 PM",
      status: "Pending"
    }
  ]);

  const [recentReports] = useState([
    {
      id: 1,
      title: "Blood Test Results",
      date: "2023-12-30",
      status: "Completed",
      type: "Laboratory"
    },
    {
      id: 2,
      title: "Chest X-Ray",
      date: "2023-12-15",
      status: "Completed",
      type: "Imaging"
    },
    {
      id: 3,
      title: "ECG Report",
      date: "2023-11-22",
      status: "Completed",
      type: "Cardiology"
    }
  ]);

  const [healthMetrics] = useState([
    {
      label: "dashboard.metrics.heartRate",
      value: "72 bpm",
      icon: Heart,
      trend: "stable",
      status: "normal"
    },
    {
      label: "dashboard.metrics.bloodPressure",
      value: "120/80",
      icon: Activity,
      trend: "stable",
      status: "normal"
    },
    {
      label: "dashboard.metrics.bmi",
      value: "22.2",
      icon: Weight,
      trend: "stable",
      status: "normal"
    },
    {
      label: "dashboard.metrics.oxygenLevel",
      value: "98%",
      icon: Zap,
      trend: "up",
      status: "normal"
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "appointment",
      message: "Appointment booked with Dr. Sarah Wilson",
      time: "2 days ago",
      icon: Calendar
    },
    {
      id: 2,
      type: "report",
      message: "Blood Test Results uploaded",
      time: "5 days ago",
      icon: FileText
    },
    {
      id: 3,
      type: "consultation",
      message: "Consultation with Dr. Michael Chen completed",
      time: "1 week ago",
      icon: UserCheck
    }
  ]);

  const quickActions = [
    {
      nameKey: "dashboard.quickActions.items.bookAppointment.name",
      descKey: "dashboard.quickActions.items.bookAppointment.description",
      icon: Calendar,
      path: "/bookappointment",
      gradient: "from-teal-500 to-emerald-600"
    },
    {
      nameKey: "dashboard.quickActions.items.viewReports.name",
      descKey: "dashboard.quickActions.items.viewReports.description",
      icon: FileText,
      path: "/patientreport",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      nameKey: "dashboard.quickActions.items.aiAssistant.name",
      descKey: "dashboard.quickActions.items.aiAssistant.description",
      icon: Bot,
      path: "/chatbot",
      gradient: "from-teal-600 to-cyan-600"
    },
    {
      nameKey: "dashboard.quickActions.items.healthCard.name",
      descKey: "dashboard.quickActions.items.healthCard.description",
      icon: QrCode,
      path: "/scanner",
      gradient: "from-cyan-500 to-teal-600"
    }
  ];

  const healthTips = [
    {
      titleKey: "dashboard.tips.stayHydrated.title",
      descriptionKey: "dashboard.tips.stayHydrated.description",
      icon: Droplets
    },
    {
      titleKey: "dashboard.tips.exercise.title",
      descriptionKey: "dashboard.tips.exercise.description",
      icon: Activity
    },
    {
      titleKey: "dashboard.tips.sleep.title",
      descriptionKey: "dashboard.tips.sleep.description",
      icon: Brain
    }
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending':
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMetricStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Welcome Header */}
      <section className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('dashboard.welcome', { userName })}</h1>
              <p className="text-xl text-teal-100 mb-4">
                {t('dashboard.overview')}
              </p>
              <div className="flex items-center gap-4 text-teal-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{currentTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-100">{t('dashboard.healthScore')}</p>
                    <p className="text-2xl font-bold">92/100</p>
                  </div>
                </div>
                <p className="text-xs text-teal-200">{t('dashboard.healthStatusExcellent')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.quickActions.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('dashboard.quickActions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(action.path)}
                className={`bg-gradient-to-br ${action.gradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <action.icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-white/90 transition-colors duration-200">
                    {t(action.nameKey)}
                  </h3>
                  <p className="text-white/80 text-sm text-center leading-relaxed">
                    {t(action.descKey)}
                  </p>
                  <div className="flex justify-center mt-4">
                    <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Metrics */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.metrics.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('dashboard.metrics.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => (
              <div key={index} className={`${getMetricStatusColor(metric.status)} p-6 rounded-2xl border-2 hover:shadow-lg transition-all duration-300 group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    metric.status === 'normal' ? 'bg-emerald-100' :
                    metric.status === 'warning' ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    <metric.icon className={`w-6 h-6 ${
                      metric.status === 'normal' ? 'text-emerald-600' :
                      metric.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                    }`} />
                  </div>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 ${
                      metric.trend === 'up' ? 'text-emerald-600' :
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-200">
                  {metric.value}
                </h3>
                <p className="text-gray-600 font-medium">{t(metric.label)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-500">{t('dashboard.metrics.normalRange')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointments and Reports Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upcoming Appointments */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.appointments.title')}</h2>
                <button
                  onClick={() => handleNavigation('/patientappointments')}
                  className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 transition-colors duration-200"
                >
                  {t('common.viewAll')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Stethoscope className="w-7 h-7 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{appointment.doctor}</h3>
                          <p className="text-gray-600 font-medium">{appointment.specialty}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-500" />
                        <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-500" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.reports.title')}</h2>
                <button
                  onClick={() => handleNavigation('/patientreport')}
                  className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 transition-colors duration-200"
                >
                  {t('common.viewAll')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <FlaskConical className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                          <p className="text-sm text-gray-600 font-medium">{report.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">{new Date(report.date).toLocaleDateString()}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.tips.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('dashboard.tips.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {healthTips.map((tip, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <tip.icon className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t(tip.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(tip.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('dashboard.cta.title')}</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-4xl mx-auto leading-relaxed">
            {t('dashboard.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => handleNavigation('/chatbot')}
              className="bg-white text-teal-700 hover:bg-gray-100 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Bot className="w-6 h-6" />
              {t('dashboard.cta.buttons.askAI')}
            </button>
            <button
              onClick={() => handleNavigation('/bookappointment')}
              className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Calendar className="w-6 h-6" />
              {t('dashboard.cta.buttons.bookAppointment')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-700 to-emerald-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Arogyam. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="text-white hover:underline transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white hover:underline transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/contact" className="text-white hover:underline transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;