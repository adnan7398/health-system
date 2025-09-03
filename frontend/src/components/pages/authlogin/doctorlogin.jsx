import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaArrowRight, FaCheckCircle, FaShieldAlt, FaUserMd, FaStethoscope, FaHospital, FaGraduationCap, FaClock, FaAward } from "react-icons/fa";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    bio: "",
    specialization: "",
    experience: "",
    hospital: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const endpoint = isSignup ? "/signup" : "/signin";
    const url = `doctor${endpoint}`;

    console.log("Sending request to:", url);
    console.log("Form Data:", formData);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data); 

      setMessage(data.message);

      if (response.ok && isSignup) {
        setIsSignup(false);
        setMessage("Account created successfully! Please login.");
      }

      if (response.ok && !isSignup) {
        localStorage.setItem("doctorToken", data.token);
        localStorage.setItem("doctorId", data.doctorId);
        navigate("/DoctorDashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong! Try again.");
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `https://arogyam-15io.onrender.com/doctor/${provider}`;
  };

  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", 
    "Gastroenterology", "Endocrinology", "Oncology", "Psychiatry", "General Medicine"
  ];

  const experienceYears = ["0-2 years", "3-5 years", "6-10 years", "11-15 years", "15+ years"];

  const benefits = [
    { icon: FaUserMd, title: "Patient Management", description: "Efficiently manage your patient records" },
    { icon: FaStethoscope, title: "AI Diagnostics", description: "Access to advanced ML tools" },
    { icon: FaHospital, title: "Hospital Integration", description: "Seamless hospital system integration" },
    { icon: FaGraduationCap, title: "Continuous Learning", description: "Access to medical conferences" },
    { icon: FaClock, title: "24/7 Support", description: "Round-the-clock technical support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Welcome & Benefits */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center lg:text-left mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 backdrop-blur-sm">
                  <FaUserMd className="text-4xl text-white" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  Welcome, Doctor
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {isSignup 
                    ? "Join Arogyam's network of healthcare professionals and transform patient care"
                    : "Sign in to access your doctor dashboard and patient management tools"
                  }
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <benefit.icon className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{benefit.title}</h3>
                      <p className="text-blue-100 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-blue-200" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaAward className="text-blue-200" />
                    <span>200+ Doctors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isSignup ? "Join as Doctor" : "Doctor Sign In"}
                </h2>
                <p className="text-gray-600">
                  {isSignup 
                    ? "Create your doctor account on Arogyam"
                    : "Access your professional healthcare dashboard"
                  }
                </p>
              </div>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 ${
                  message.includes("successfully") || message.includes("created") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {message.includes("successfully") || message.includes("created") ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaShieldAlt className="text-red-600" />
                    )}
                    {message}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignup && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Dr. First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization *
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Experience</option>
                        {experienceYears.map((exp) => (
                          <option key={exp} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hospital/Clinic *
                      </label>
                      <input
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Hospital or Clinic Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio *
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Brief description of your expertise and experience..."
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSignup ? "Create Doctor Account" : "Sign In"}
                    <FaArrowRight className="text-sm" />
                  </div>
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
                    onClick={() => handleSocialLogin("/google")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaGoogle className="text-red-500 text-lg" />
                  </button>
                  <button
                    onClick={() => handleSocialLogin("/facebook")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaFacebook className="text-blue-600 text-lg" />
                  </button>
                  <button
                    onClick={() => handleSocialLogin("/apple")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaApple className="text-gray-800 text-lg" />
                  </button>
                </div>
              </div>

              {/* Toggle Sign In/Sign Up */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {isSignup ? "Already have a doctor account?" : "New to Arogyam?"}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    {isSignup ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

              {/* Terms */}
              {isSignup && (
                <p className="mt-6 text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
