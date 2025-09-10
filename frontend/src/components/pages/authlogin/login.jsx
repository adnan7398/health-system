import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeartbeat, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaArrowRight, FaCheckCircle, FaShieldAlt, FaUserMd, FaQrcode, FaRobot, FaFlask, FaAmbulance } from "react-icons/fa";

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

  // Get the intended destination from the ProtectedRoute, but default to scanner
  const from = location.state?.from?.pathname || "/scanner";

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", "patient");
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        } else {
          // Attempt to extract user ID from token if available
          try {
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            if (tokenPayload.id) {
              localStorage.setItem("userId", tokenPayload.id);
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
    { icon: FaUserMd, title: "Online Doctor Consultation", description: "Connect with top specialists 24/7" },
    { icon: FaQrcode, title: "Digital Health Records", description: "Secure access to medical history" },
    { icon: FaFlask, title: "Lab Tests at Home", description: "Convenient diagnostic services" },
    { icon: FaRobot, title: "AI Health Assistant", description: "24/7 medical guidance" },
    { icon: FaAmbulance, title: "Emergency Support", description: "Quick medical assistance" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Welcome & Features */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center lg:text-left mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 backdrop-blur-sm">
                  <FaHeartbeat className="text-4xl text-white" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  Welcome to Arogyam
                </h2>
                <p className="text-emerald-100 text-lg leading-relaxed">
                  {isSignup 
                    ? "Join millions of users who trust Arogyam for their healthcare needs"
                    : "Sign in to continue your healthcare journey with Arogyam"
                  }
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-emerald-100 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-emerald-100">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-emerald-200" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-200" />
                    <span>Trusted by 50K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="text-gray-600">
                {isSignup 
                  ? "Join Arogyam today and take control of your health"
                  : "Sign in to access your health dashboard"
                }
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-center ${
                message.includes("successfully") || message.includes("created") 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isSignup ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isSignup ? "Create Account" : "Sign In"}
                    <FaArrowRight className="text-sm" />
                  </div>
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSocialLogin("/auth/google")}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaGoogle className="text-red-500 text-lg" />
                </button>
                <button
                  onClick={() => handleSocialLogin("/auth/facebook")}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaFacebook className="text-emerald-600 text-lg" />
                </button>
                <button
                  onClick={() => handleSocialLogin("/auth/apple")}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaApple className="text-gray-900 text-lg" />
                </button>
              </div>
            </div>

            {/* Toggle Signup/Login */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
