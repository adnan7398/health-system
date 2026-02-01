import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Chrome,
  Facebook,
  Apple,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Activity
} from "lucide-react";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Enter a valid email.";
    if (!formData.password) errs.password = "Password is required.";
    else if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (isSignup && !formData.firstName)
      errs.firstName = "First name is required.";
    if (isSignup && !formData.lastName)
      errs.lastName = "Last name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setAuthSuccess(false);
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    const endpoint = isSignup ? "/signup" : "/signin";
    const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');

    try {
      const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (data.message) setMessage(data.message);
      else if (data.error) setMessage(data.error);
      else setMessage("An error occurred. Please try again.");

      if (response.ok && isSignup) {
        setIsSignup(false);
        setMessage("Account created successfully! Please login.");
        setAuthSuccess(true);
      }

      if (response.ok && !isSignup) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userRole", "patient");
        if (data.userId) sessionStorage.setItem("userId", data.userId);
        else {
          try {
            const payload = JSON.parse(atob((data.token || "").split(".")[1] || ""));
            if (payload && payload.id) sessionStorage.setItem("userId", payload.id);
          } catch (err) { console.error(err); }
        }

        if (rememberMe) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", "patient");
          const uid = sessionStorage.getItem("userId");
          if (uid) localStorage.setItem("userId", uid);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userId");
        }

        setAuthSuccess(true);
        const userInfo = {
          name: (data.user?.firstName ? `${data.user.firstName} ${data.user.lastName || ''}`.trim() : null) ||
            (formData.firstName ? `${formData.firstName} ${formData.lastName || ''}`.trim() : null) ||
            (data.user?.email || formData.email).split('@')[0],
          email: data.user?.email || formData.email
        };
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        if (rememberMe) localStorage.setItem("userInfo", JSON.stringify(userInfo));

        setTimeout(() => {
          navigate("/scanner", { replace: true });
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('localStorageChange'));
        }, 500);
      } else {
        setAuthSuccess(false);
      }
    } catch (error) {
      setMessage("Something went wrong! Try again.");
      setAuthSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
    window.location.href = `${API_BASE}${provider}`;
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans text-slate-900 overflow-hidden">

      {/* Left Panel - Visual Branding (Desktop) - Adjusted padding */}
      <div className={`hidden lg:flex w-5/12 relative overflow-hidden bg-slate-900 transition-all duration-1000 ease-out ${animate ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        {/* Branding Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
              <Heart className="w-4 h-4 text-teal-400" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">AROGYAM</span>
          </div>

          <div className="space-y-6 mb-12">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white leading-tight">
                Healthcare <br />
                <span className="text-teal-400">Reimagined.</span>
              </h1>
              <p className="text-slate-300 text-base max-w-sm leading-relaxed">
                Experience the future of medical diagnostics and patient care with our AI-powered platform.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-2 text-white/80 text-xs">
                <Activity className="w-3 h-3 text-teal-400" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-2 text-white/80 text-xs">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>Secure Data</span>
              </div>
            </div>
          </div>

          <div className="text-slate-500 text-[10px] font-medium">
            © 2024 Arogyam Health Systems. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-surface-50 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className={`w-full max-w-[380px] space-y-5 transition-all duration-700 delay-300 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {isSignup ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isSignup ? "Enter your details to get started." : "Please enter your details to sign in."}
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg flex items-start gap-2 text-xs ${authSuccess ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
              {authSuccess ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {isSignup && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                    placeholder="John"
                  />
                  {errors.firstName && <span className="text-[10px] text-red-500">{errors.firstName}</span>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="text-[10px] text-red-500">{errors.lastName}</span>}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="text-[10px] text-red-500">{errors.password}</span>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me</span>
              </label>
              {!isSignup && (
                <a href="#" className="text-xs font-semibold text-teal-600 hover:text-teal-700">Forgot password?</a>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isSignup ? "Create account" : "Sign in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>

          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Chrome, path: "/auth/google" },
              { icon: Apple, path: "/auth/apple" },
              { icon: Facebook, path: "/auth/facebook" }
            ].map((social, i) => (
              <button
                key={i}
                onClick={() => handleSocialLogin(social.path)}
                className="flex items-center justify-center py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <social.icon className="w-4 h-4 text-slate-700" />
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-600 pt-2">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Auth;
