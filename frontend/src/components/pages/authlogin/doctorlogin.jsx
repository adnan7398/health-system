import React, { useState } from "react";
import "../authlogin/login.css";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-left">
            <h2>Welcome to Arogyam</h2>
            <p>Sign in to continue access as Doctor</p>
            <img src="/logo1.png" alt="Logo" className="auth-logo" />
          </div>
          <div className="auth-right">
            <h2>{isSignup ? "Sign Up (Doctor)" : "Sign In (Doctor)"}</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
              {isSignup && (
                <>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              {isSignup && (
                <>
                  <input
                    type="text"
                    name="bio"
                    placeholder="Bio"
                    required
                    value={formData.bio}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="experience"
                    placeholder="Experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="hospital"
                    placeholder="Hospital Name"
                    required
                    value={formData.hospital}
                    onChange={handleChange}
                  />
                </>
              )}
              <button type="submit">{isSignup ? "Sign Up" : "Sign in"}</button>
            </form>
            <div className="social-login">
              <button
                onClick={() => handleSocialLogin("google")}
                className="google-btn"
              >
                Sign in with Google
              </button>
              <button
                onClick={() => handleSocialLogin("linkedin")}
                className="linkedin-btn"
              >
                Sign in with LinkedIn
              </button>
            </div>
            <p onClick={() => setIsSignup(!isSignup)} className="signup-link">
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
