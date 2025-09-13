import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/scanner";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate(from, { replace: true });
  }, [navigate, from]);

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
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    const endpoint = isSignup ? "/signup" : "/signin";
    try {
      const response = await fetch(
        `https://arogyam-15io.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setMessage(data.message);

      if (response.ok && isSignup) {
        setIsSignup(false);
        setMessage("Account created successfully! Please login.");
      }

      if (response.ok && !isSignup) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.token);
        storage.setItem("userRole", "patient");
        if (data.userId) {
          storage.setItem("userId", data.userId);
        } else {
          try {
            const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
            if (tokenPayload.id) storage.setItem("userId", tokenPayload.id);
          } catch (error) {
            console.error("Error parsing token:", error);
          }
        }
        navigate("/scanner", { replace: true });
      }
    } catch (error) {
      setMessage("Something went wrong! Try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) =>
    (window.location.href = `https://arogyam-15io.onrender.com${provider}`);

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
                  response.ok
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
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
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="form-checkbox"
                  />
                  Remember me
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
                className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition"
              >
                <Facebook className="w-5 h-5 text-blue-500" />
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
