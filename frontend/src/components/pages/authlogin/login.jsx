import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
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

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
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
        navigate("/scanner");
      }
    } catch (error) {
      setMessage("Something went wrong! Try again.");
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <h2>Welcome to Arogyam</h2>
          <p>Sign in to continue access</p>
          <img src="/logo1.png" alt="Logo" className="auth-logo" />
        </div>
        <div className="auth-right">
          <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>
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
            <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
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
  );
};

export default Auth;
