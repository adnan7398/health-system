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
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Get user info from storage
    let userInfoStr = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo.name) {
          setUserName(userInfo.name);
        }
      } catch (e) {
        console.error("Error parsing userInfo:", e);
      }
    }
  }, []);
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

  const quickActions = [
    {
      nameKey: "dashboard.quickActions.items.bookAppointment.name",
      descKey: "dashboard.quickActions.items.bookAppointment.description",
      icon: Calendar,
      path: "/bookappointment",
      color: "bg-blue-50 text-blue-600"
    },
    {
      nameKey: "dashboard.quickActions.items.viewReports.name",
      descKey: "dashboard.quickActions.items.viewReports.description",
      icon: FileText,
      path: "/patientreport",
      color: "bg-primary-50 text-primary-600"
    },
    {
      nameKey: "dashboard.quickActions.items.aiAssistant.name",
      descKey: "dashboard.quickActions.items.aiAssistant.description",
      icon: Bot,
      path: "/chatbot",
      color: "bg-purple-50 text-purple-600"
    },
    {
      nameKey: "dashboard.quickActions.items.healthCard.name",
      descKey: "dashboard.quickActions.items.healthCard.description",
      icon: QrCode,
      path: "/scanner",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      nameKey: "Lab Report Analyzer",
      descKey: "Analyze lab reports with desi remedies",
      icon: FlaskConical,
      path: "/labreport",
      color: "bg-orange-50 text-orange-600"
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
        return 'bg-green-100 text-green-700 border-green-200';
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
        return 'text-primary-600 bg-primary-50 border-primary-100';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Welcome Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2 text-slate-900">{t('dashboard.welcome', { userName })}</h1>
              <div className="flex items-center gap-4 text-slate-500">
                <span>{t('dashboard.overview')}</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{currentTime}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex items-center gap-4">
              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-primary-600 font-semibold uppercase">{t('dashboard.healthScore')}</p>
                  <p className="text-xl font-bold text-primary-800">92/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Quick Actions */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.quickActions.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(action.path)}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-primary-700 transition-colors">
                  {t(action.nameKey) || action.nameKey}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {t(action.descKey)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Health Metrics */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('dashboard.metrics.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className={`p-6 rounded-xl border hover:shadow-md transition-all ${getMetricStatusColor(metric.status)} bg-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50`}>
                    <metric.icon className="w-5 h-5 opacity-80" />
                  </div>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/50`}>
                      <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                      <span>{metric.trend === 'up' ? '+2%' : 'Active'}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium opacity-80">{t(metric.label)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Grid: Appointments & Reports */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t('dashboard.appointments.title')}</h2>
              <button
                onClick={() => handleNavigation('/patientappointments')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{appointment.doctor}</h3>
                      <p className="text-slate-500 text-sm">{appointment.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-sm text-slate-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Tips */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('dashboard.tips.title')}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {healthTips.map((tip, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <tip.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-sm">{t(tip.titleKey)}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3">{t(tip.descriptionKey)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Reports & CTA */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t('dashboard.reports.title')}</h2>
              <button
                onClick={() => handleNavigation('/patientreport')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {recentReports.map((report, idx) => (
                <div key={report.id} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between ${idx !== recentReports.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{report.title}</p>
                      <p className="text-xs text-slate-500">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>

            {/* Promo / CTA Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-bold mb-2 z-10 relative">Need AI Asistance?</h3>
              <p className="text-primary-100 text-sm mb-6 z-10 relative">Chat with our advanced AI to understand your symptoms better.</p>
              <button
                onClick={() => handleNavigation('/chatbot')}
                className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
              >
                <Bot className="w-5 h-5" /> Start Chat
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;