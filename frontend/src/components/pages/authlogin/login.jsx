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
  Apple
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

  // Get the intended destination from the ProtectedRoute, but default to scanner
  const from = (location.state)?.from?.pathname || "/scanner";

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs ={};
    if (!formData.email) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Enter a valid email.";
    if (!formData.password) errs.password = "Password is required.";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (isSignup && !formData.firstName) errs.firstName = "First name is required.";
    if (isSignup && !formData.lastName) errs.lastName = "Last name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // client-side validation
    if (!validate()) {
      setLoading(false);
      return;
    }

    const endpoint = isSignup ? "/signup" : "/signin";

    try {
      const response = await fetch(`https://arogyam-15io.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok && isSignup) {
        setIsSignup(false);
        setMessage("Account created successfully! Please login.");
      }

      if (response.ok && !isSignup) {
        // Persist token according to "Remember me"
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.token);
        storage.setItem("userRole", "patient");
        if (data.userId) {
          storage.setItem("userId", data.userId);
        } else {
          // Attempt to extract user ID from token if available
          try {
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            if (tokenPayload.id) {
              storage.setItem("userId", tokenPayload.id);
            }
          } catch (error) {
            console.error("Error parsing token:", error);
          }
        }
        
        // Redirect to scanner page after successful login
        navigate("/scanner", { replace: true });
      }
    } catch (error) {
      setMessage("Something went wrong! Try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `https://arogyam-15io.onrender.com${provider}`;
  };

  const features = [
    { icon: UserCheck, title: "Online Doctor Consultation", description: "Connect with top specialists 24/7" },
    { icon: QrCode, title: "Digital Health Records", description: "Secure access to medical history" },
    { icon: FlaskConical, title: "Lab Tests at Home", description: "Convenient diagnostic services" },
    { icon: Bot, title: "AI Health Assistant", description: "24/7 medical guidance" },
    { icon: Ambulance, title: "Emergency Support", description: "Quick medical assistance" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 antialiased">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left - Brand & Features */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white rounded-3xl p-12 shadow-2xl overflow-hidden relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute top-1/2 right-0 w-32 h-32 bg-white rounded-full translate-x-16"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-white rounded-full translate-x-14 translate-y-14"></div>
          </div>

          <div className="relative z-10">
            {/* Brand Header */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <div>
                <h2 className="text-4xl font-bold tracking-tight">Welcome to Arogyam</h2>
                <p className="text-emerald-100 mt-2 text-lg">Better care, powered by AI — secure and always available.</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6 mt-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-1">{feature.title}</h3>
                    <p className="text-emerald-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
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
        {/* right panel: remove mobile tap highlight via inline style and keep layout */}
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-600 opacity-90"></div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center relative z-10">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
          </div>

          {/* enforce neutral text color for the entire right panel to avoid accidental blue inheritance */}
          <div className="p-8 lg:p-10 text-slate-800" style={{ WebkitTapHighlightColor: "transparent" }}>
            {/* Form Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {isSignup 
                  ? "Join Arogyam and take control of your health journey with personalized care." 
                  : "Sign in to access your personalized health dashboard and continue your wellness journey."
                }
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
                message.includes("success") || message.includes("created") 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {isSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">First name</label>
                    <input 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      required 
                      autoComplete="given-name"
                      className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 transition-all duration-200 ${
                        errors.firstName ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    />
                    {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Last name</label>
                    <input 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      required 
                      autoComplete="family-name"
                      className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 transition-all duration-200 ${
                        errors.lastName ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    />
                    {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">Email address</label>
                <input 
                  id="email" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  autoComplete="email"
                  className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 transition-all duration-200 ${
                    errors.email ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Password</label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className={`w-full px-4 py-4 pr-12 border-2 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 transition-all duration-200 ${
                      errors.password ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      className="w-4 h-4 rounded border-slate-300 accent-emerald-600 focus:outline-none focus:ring-0"
                    />
                    <span className="text-sm font-medium text-slate-700">Remember me</span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 rounded"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600 ring-offset-0"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isSignup ? "Creating Account..." : "Signing In..."}</span>
                  </div>
                ) : (
                  <>
                    <span>{isSignup ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleSocialLogin("/auth/google")}
                className="flex items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Chrome className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>
              <button
                onClick={() => handleSocialLogin("/auth/facebook")}
                className="flex items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Facebook className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>
              <button
                onClick={() => handleSocialLogin("/auth/apple")}
                className="flex items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Apple className="w-5 h-5 text-slate-800 group-hover:text-slate-900" />
              </button>
            </div>

            {/* Toggle Auth Mode */}
            <div className="mt-8 text-center">
              <span className="text-slate-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
              </span>
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 rounded"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
              <p className="mb-3">
                By continuing you agree to our{" "}
                <a href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">Privacy Policy</a>
              </p>
              <p className="text-slate-400">© {new Date().getFullYear()} Arogyam. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;