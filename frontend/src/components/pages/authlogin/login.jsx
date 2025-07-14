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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const endpoint = isSignup ? "/signup" : "/signin";

    try {
      const response = await fetch(`https://arogyam-15io.onrender.com/${endpoint}`, {
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
        
        // Save the userId if it exists in the response
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        } else {
          // If userId is not in the response, extract it from the token
          try {
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            if (tokenPayload.id) {
              localStorage.setItem("userId", tokenPayload.id);
            }
          } catch (error) {
            console.error("Error parsing token:", error);
          }
        }
        
        navigate("/scanner");
      }
    } catch (error) {
      setMessage("Something went wrong! Try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
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
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          <div className="social-login">
            <button
              onClick={() => handleSocialLogin("google")}
              className="google-btn"
              disabled={loading}
            >
              Sign in with Google
            </button>
            <button
              onClick={() => handleSocialLogin("linkedin")}
              className="linkedin-btn"
              disabled={loading}
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
