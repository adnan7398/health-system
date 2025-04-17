import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFacebook,
  FaHeartbeat,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import { ChevronRight } from "lucide-react";

import "./home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chatbot"); // Redirect to chatbot if logged in
    } else {
      navigate("/signin"); // Redirect to login if not logged in
    }
  };

  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    // Fetch QR code from the backend
    const fetchQRCode = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGIzMWZlZGRhZWM5YzQ0N2QyYTQzOCIsImlhdCI6MTc0MjQxODQzNH0.La-6Tdt9JZvTsbbsymKHAW3fcrY-jVV-dBDkx3qsVS0"; // Replace with actual token from login/session
        const email = "Test1233@example.com"; // Replace with the user's email
        const firstName = "Johndee"; // Replace with the user's first name
        const lastName = "Doeef"; // Replace with the user's last name
        const bloodGroup = "A+"; // Replace with the user's blood group
        const diabetes = false; // Replace with diabetes info
        const cholesterol = false; // Replace with cholesterol info
        const weight = 35; // Replace with weight info

        // Make the API request with Authorization in headers and data in the body
        const response = await fetch("http://127.0.0.1:3000/register", {
          method: "POST", // Assuming POST request for registration
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header with token
          },
          body: JSON.stringify({
            // Data in the body
            email,
            firstName,
            lastName,
            bloodGroup,
            diabetes,
            cholesterol,
            weight,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch QR code");
        }

        const data = await response.json();

        // Extract QR code from the response and set it in state
        setQrCode(data.qrCode);
      } catch (err) {
        console.error("Error fetching QR code:", err);
      }
    };

    fetchQRCode();
  }, []);

  const featuresData = [
    {
      title: "QR-Based Patient Card",
      description:
        "Instantly access medical records via QR code. Quick retrieval during emergencies. Ensures efficient patient care.",
      image: "qrcode.png",
    },
    {
      title: "AI-Driven Predictive Analytics",
      description:
        "Predicts health risks using patient history. Enables early preventive care. Enhances treatment outcomes.",
      image: "predictive.png",
    },
    {
      title: "AI Medical Assistant",
      description:
        "Offers symptom analysis and medication reminders. Provides instant health advice. Supports continuous monitoring.",
      image: "chatbot.png",
    },
    {
      title: "Real-Time Data Sharing",
      description:
        "Securely exchanges medical data. Facilitates faster diagnosis. Improves coordination between healthcare providers.",
      image: "datasharing.png",
    },
    {
      title: "Smart Appointment Scheduling",
      description:
        "Simplifies booking and rescheduling. Sends automated reminders. Reduces wait times and scheduling conflicts.",
      image: "scheduling.png",
    },
    {
      title: "Emergency SOS Alerts",
      description:
        "Sends instant alerts with location and medical details. Ensures quick assistance. Enhances personal safety.",
      image: "sos.png",
    },
  ];

  return (
    <div className="home">
      <div dangerouslySetInnerHTML={{ __html: qrCode }} />
      <div
        className="hero-container"
        style={{ backgroundImage: "url('/home1.png')" }}
      >
        <div className="overlay"></div>
        <div className="content">
          <h1>
            AI-Powered Healthcare: Faster Access, Smarter Diagnosis, Better
            Lives!
          </h1>
          <p>
            <strong>Arogyam</strong> harnesses the power of AI to provide
            instant medical access, smart diagnostics, and real-time health
            monitoring.
          </p>
          <a href="#about" className="cta-button">
            Know More
          </a>
        </div>
      </div>

      {/*chatbot container*/}

      <div className="chatbot-container">
        <div className="chatbot-card">
          <h2>
            <span className="highlight">AroVeda</span>
          </h2>
          <h4>Your Virtual Healthcare Assistant</h4>
          <p>
            Your trusted virtual healthcare companion, guiding you toward
            wellness with every conversation.
          </p>
          <button onClick={handleClick} className="get-started-button">
            <FaHeartbeat size={20} className="icon-left" />
            <span>Discover Wellness</span>
            <ChevronRight size={20} className="icon-right" />
          </button>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-image">
          <img src="/logo.png" alt="Profile" />
        </div>
        <div className="about-content">
          <h2>Arogyam</h2>
          <h4>
            AI-Powered Healthcare System for Smart Diagnosis & Patient Care
          </h4>
          <p>
            <strong>Arogyam</strong> is an AI-powered healthcare solution
            designed to bridge the gap in medical assistance by leveraging smart
            diagnostics, real-time data access, and predictive analytics. It
            provides instant medical access through a QR-based patient card,
            AI-driven symptom analysis, and real-time data sharing for faster
            emergency response.
          </p>
          <p>
            The system enhances hospital efficiency with AI-powered patient flow
            management, reducing wait times and optimizing treatment
            prioritization. It also offers AI-driven early disease detection,
            personalized health insights, and a smart appointment scheduler for
            seamless patient-doctor interactions. By integrating AI medical
            assistants, chatbot support, and IoT-enabled monitoring, Arogyam
            ensures timely, accurate, and efficient healthcare delivery. Its
            scalable and innovative approach revolutionizes patient care, making
            healthcare more accessible and effective for all.
          </p>
          <p></p>
        </div>
      </section>
      {/*features section*/}
      <section id="features" className="features-section">
        <h2 className="features-heading">Our Features</h2>
        <div className="features-container">
          {featuresData.map((feature, index) => (
            <div key={index} className="feature-card">
              <img
                src={feature.image}
                alt={feature.title}
                className="feature-image"
              />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="testimonials-heading">See What Our Users Say!</h2>
        <div className="testimonials-container">
          {[
            {
              name: "Alice Johnson",
              feedback:
                "Arogyam transformed the way I manage my health. Instant access to my medical records has been a lifesaver!",
              rating: 5, // Rating out of 5
            },
            {
              name: "Mark Benson",
              feedback:
                "The AI medical assistant is truly helpful! It gives me instant advice on my symptoms.",
              rating: 4, // Rating out of 5
            },
            {
              name: "Sophia Patel",
              feedback:
                "The QR-based patient card is a game-changer. My doctor gets all my medical history instantly!",
              rating: 5, // Rating out of 5
            },
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img
                src={`https://i.pravatar.cc/150?img=${index + 5}`}
                alt={testimonial.name}
                className="testimonial-profile"
              />
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <div className="testimonial-rating">
                {"★".repeat(testimonial.rating)}
                {"☆".repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-feedback">"{testimonial.feedback}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="appointment-section">
        <h2 className="appointment-heading">BOOK AN APPOINTMENT</h2>
        <div className="appointment-container">
          {/* Main Content */}
          <div className="appointment-content">
            {/* Left Side - Text Section */}
            <div className="text-section">
              <h3 className="subheading">
                Expert Consultation at Your Convenience
              </h3>
              <p className="description">
                Schedule an appointment with our experienced professionals and
                get the guidance you need. Whether it's a health check-up, a
                business consultation, or a service appointment, we ensure a
                seamless experience tailored to your needs.
              </p>
              <p className="description">
                Select your preferred date and time, and let us take care of the
                rest.
              </p>
              <a href="/signin" className="learn-more">
                Schedule Now
              </a>
            </div>

            {/* Right Side - Image */}
            <div className="person">
              <img src="bookapp.png" alt="Appointment" />
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-container">
          <div class="footer-section company">
            <h2>Company</h2>
            <p>
              Empowering businesses with innovation and technology. Providing
              reliable solutions for a better future.
            </p>
          </div>

          <div class="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div class="footer-section social">
            <h2>Follow Us</h2>
            <div class="social-icons">
              <a href="#">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div class="footer-section contact">
            <h2>Contact Us</h2>
            <p>Email: support@example.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 YourCompany | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
