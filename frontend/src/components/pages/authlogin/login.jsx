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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center p-6 antialiased">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Brand & Features */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-3xl p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <FaHeartbeat className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold">Welcome to Arogyam</h2>
                <p className="text-emerald-100 mt-1">Better care, powered by AI — secure and always available.</p>
              </div>
            </div>

            <ul className="space-y-4 mt-6">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-emerald-100 text-sm">{feature.description}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-6 text-sm text-emerald-100">
                <div className="flex items-center gap-2">
                  <FaShieldAlt />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle />
                  <span>Trusted by 50K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header shading (matches left panel) */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-4 lg:p-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaHeartbeat className="text-2xl" />
            </div>
          </div>

          <div className="max-w-md mx-auto p-8 lg:p-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{isSignup ? "Create Account" : "Welcome Back"}</h3>
              <p className="text-sm text-slate-500">{isSignup ? "Join Arogyam and take control of your health." : "Sign in to access your personalized health dashboard."}</p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-md text-center ${message.includes("success") || message.includes("created") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">First name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required autoComplete="given-name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Last name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required autoComplete="family-name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required autoComplete={isSignup ? "new-password" : "current-password"}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-emerald-600 hover:underline">Forgot password?</a>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 shadow-md">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isSignup ? "Creating..." : "Signing in..."}</span>
                  </div>
                ) : (
                  <>
                    <span>{isSignup ? "Create Account" : "Sign In"}</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="my-4 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleSocialLogin("/auth/google")} aria-label="Continue with Google"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                <FaGoogle className="text-red-500" />
                <span className="sr-only">Google</span>
              </button>
              <button onClick={() => handleSocialLogin("/auth/facebook")} aria-label="Continue with Facebook"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                <FaFacebook className="text-blue-600" />
                <span className="sr-only">Facebook</span>
              </button>
              <button onClick={() => handleSocialLogin("/auth/apple")} aria-label="Continue with Apple"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                <FaApple className="text-slate-800" />
                <span className="sr-only">Apple</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
              </span>
              <button onClick={() => setIsSignup(!isSignup)} className="ml-2 text-emerald-600 font-semibold hover:underline">
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              By continuing you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
