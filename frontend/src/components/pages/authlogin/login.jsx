import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHeartbeat,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaUserMd,
  FaQrcode,
  FaRobot,
  FaFlask,
  FaAmbulance,
} from "react-icons/fa";

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

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/scanner";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate(from, { replace: true });
  }, [navigate, from]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", "patient");
        if (data.userId) localStorage.setItem("userId", data.userId);
        else {
          try {
            const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
            if (tokenPayload.id)
              localStorage.setItem("userId", tokenPayload.id);
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
      icon: FaUserMd,
      title: "Online Doctor Consultation",
      description: "Connect with top specialists 24/7",
    },
    {
      icon: FaQrcode,
      title: "Digital Health Records",
      description: "Secure access to medical history",
    },
    {
      icon: FaFlask,
      title: "Lab Tests at Home",
      description: "Convenient diagnostic services",
    },
    {
      icon: FaRobot,
      title: "AI Health Assistant",
      description: "24/7 medical guidance",
    },
    {
      icon: FaAmbulance,
      title: "Emergency Support",
      description: "Quick medical assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#008080] via-[#006666] to-[#004466] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-28 h-28 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-full translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <FaHeartbeat className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Welcome to Arogyam
              </h2>
              <p className="text-emerald-100 mt-1 max-w-xs">
                Better care, powered by AI — secure and always available.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mt-4 text-left">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mt-1">
                    <feature.icon className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {feature.title}
                    </div>
                    <div className="text-emerald-100 text-sm">
                      {feature.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer Info */}
            <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row justify-center gap-6 text-sm text-emerald-100">
              <div className="flex items-center gap-2 justify-center">
                <FaShieldAlt /> Secure & Private
              </div>
              <div className="flex items-center gap-2 justify-center">
                <FaCheckCircle /> Trusted by 50K+
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="max-w-md mx-auto p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="text-sm text-slate-500">
                {isSignup
                  ? "Join Arogyam and take control of your health."
                  : "Sign in to access your personalized health dashboard."}
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-center text-sm ${
                  message.toLowerCase().includes("success") ||
                  message.toLowerCase().includes("created")
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                  />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                  />
                </div>
              )}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full px-2 py-2 pr-9 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm mt-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm mt-2"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-xs" />
                  ) : (
                    <FaEye className="text-xs" />
                  )}
                </button>
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-emerald-600 hover:underline text-sm"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isSignup ? "Creating..." : "Signing in..."}
                  </div>
                ) : (
                  <>
                    <span>{isSignup ? "Create Account" : "Sign In"}</span>
                    <FaArrowRight className="text-sm" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSocialLogin("/auth/google")}
                className="flex items-center justify-center gap-2 px-2 py-2 bg-white border rounded-lg shadow hover:shadow-md transition text-sm"
              >
                <FaGoogle className="text-red-500 text-base" />
              </button>
              <button
                onClick={() => handleSocialLogin("/auth/facebook")}
                className="flex items-center justify-center gap-2 px-2 py-2 bg-white border rounded-lg shadow hover:shadow-md transition text-sm"
              >
                <FaFacebook className="text-blue-600 text-base" />
              </button>
              <button
                onClick={() => handleSocialLogin("/auth/apple")}
                className="flex items-center justify-center gap-2 px-2 py-2 bg-white border rounded-lg shadow hover:shadow-md transition text-sm"
              >
                <FaApple className="text-slate-800 text-base" />
              </button>
            </div>

            {/* Toggle Sign Up / Sign In */}
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-emerald-600 font-semibold hover:underline text-sm"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </div>

            {/* Terms */}
            <div className="mt-4 text-center text-xs text-slate-400">
              By continuing you agree to our{" "}
              <a href="/terms" className="underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
