import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Shield,
  UserCheck,
  QrCode,
  Bot,
  FlaskConical,
  Ambulance,
  Chrome,
  Facebook,
  Apple,
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

  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from the ProtectedRoute, default to scanner (required first step)
  const from = (location.state)?.from?.pathname || "/scanner";

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
      console.log("Login response:", data);
      console.log("Response status:", response.status);
      
      // Set message with better error handling
      if (data.message) {
      setMessage(data.message);
      } else if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("An error occurred. Please try again.");
      }

      if (response.ok && isSignup) {
        setIsSignup(false);
        setMessage("Account created successfully! Please login.");
        setAuthSuccess(true);
      }

      if (response.ok && !isSignup) {
        // Persist token consistently:
        // - always sessionStorage for SPA checks
        // - mirror to localStorage only when rememberMe is true
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userRole", "patient");
        if (data.userId) sessionStorage.setItem("userId", data.userId);
        else {
          try {
            const payload = JSON.parse(atob((data.token || "").split(".")[1] || ""));
            if (payload && payload.id) sessionStorage.setItem("userId", payload.id);
          } catch (err) {
            console.error("Error parsing token payload:", err);
          }
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

        // Store user info for display
        if (data.user) {
          const userInfo = {
            name: data.user.firstName ? `${data.user.firstName} ${data.user.lastName || ''}`.trim() : data.user.email?.split('@')[0] || 'User',
            email: data.user.email || formData.email
          };
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          if (rememberMe) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
        } else {
          // Fallback: use form data
          const userInfo = {
            name: formData.firstName ? `${formData.firstName} ${formData.lastName || ''}`.trim() : formData.email?.split('@')[0] || 'User',
            email: formData.email
          };
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          if (rememberMe) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
        }

        // Check if scanner is already verified
        let scannerVerified = false;
        try {
          const verificationData = localStorage.getItem("scannerVerified");
          if (verificationData) {
            const parsed = JSON.parse(verificationData);
            scannerVerified = parsed.verified === true;
          }
        } catch (e) {
          console.error("Error checking scanner verification:", e);
        }

        // Always redirect to scanner first (required step after login)
        // Scanner will then redirect to dashboard after verification
        const redirectPath = "/scanner";

        // Delay navigation one tick so ProtectedRoute/readers see the sessionStorage token
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
          // Trigger storage event to update header
          window.dispatchEvent(new Event('storage'));
          // Force header to re-check auth
          window.dispatchEvent(new Event('localStorageChange'));
        }, 20);
      } else {
        setAuthSuccess(false);
      }
    } catch (error) {
      setMessage("Something went wrong! Try again.");
      setAuthSuccess(false);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://arogyam-15io.onrender.com');
    window.location.href = `${API_BASE}${provider}`;
  };

  const features = [
    {
      icon: UserCheck,
      title: "Online Doctor Consultation",
      description: "Connect with top specialists 24/7",
    },
    {
      icon: QrCode,
      title: "Digital Health Records",
      description: "Secure access to medical history",
    },
    {
      icon: FlaskConical,
      title: "Lab Tests at Home",
      description: "Convenient diagnostic services",
    },
    {
      icon: Bot,
      title: "AI Health Assistant",
      description: "24/7 medical guidance",
    },
    {
      icon: Ambulance,
      title: "Emergency Support",
      description: "Quick medical assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 antialiased">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left - Brand & Features */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#008080] via-[#006666] to-[#004466] text-white rounded-3xl p-12 shadow-2xl overflow-hidden relative">
          {/* Decorative Background Circles */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute top-1/2 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-white rounded-full translate-x-14 translate-y-14"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Brand Title */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white mr-16">
                  Welcome to Arogyam
                </h2>
                <p className="text-emerald-100 mt-2 text-lg">
                  Better care, powered by AI — secure and always available.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6 mt-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-emerald-100 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Highlights */}
            <div className="mt-10 pt-8 border-t border-white/20">
              <div className="flex items-center gap-8 text-emerald-100">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Trusted by 50K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Authentication Form */}
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <div className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#004466] text-white p-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#008080] via-[#006666] to-[#004466] opacity-90"></div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center relative z-10">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
          </div>
          <div
            className="p-8 lg:p-10 text-slate-800"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {isSignup
                  ? "Join Arogyam and take control of your health journey with personalized care."
                  : "Sign in to access your personalized health dashboard and continue your wellness journey."}
              </p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-center font-medium ${
                  authSuccess
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* accessible checkbox-toggle for "Remember me" */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    aria-label="Remember me"
                  />
                  <div
                    className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                      rememberMe ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                    onClick={() => setRememberMe((v) => !v)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(ev) => { if (ev.key === " " || ev.key === "Enter") setRememberMe((v) => !v); }}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${rememberMe ? "translate-x-4" : ""}`} />
                  </div>
                  <div className="text-sm text-slate-600">
                    <div className="font-medium">Remember me</div>
                    <div className="text-xs text-slate-400">Stay signed in on this device</div>
                  </div>
                </label>
                {!isSignup && (
                  <a
                    href="#"
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => handleSocialLogin("/auth/google")}
                className="p-3 rounded-full bg-red-50 hover:bg-red-100 transition"
              >
                <Chrome className="w-5 h-5 text-red-500" />
              </button>
              <button
                onClick={() => handleSocialLogin("/auth/facebook")}
                className="p-3 rounded-full bg-emerald-50 hover:bg-emerald-100 transition"
              >
                <Facebook className="w-5 h-5 text-emerald-600" />
              </button>
              <button
                onClick={() => handleSocialLogin("/auth/apple")}
                className="p-3 rounded-full bg-black/10 hover:bg-black/20 transition"
              >
                <Apple className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
