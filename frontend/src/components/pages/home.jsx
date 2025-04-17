import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaHeartbeat, FaInstagram, FaLinkedin, FaTwitter, FaStar } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./home.css";

const Home = () => {
  const { t } = useTranslation();
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
      image: "qrcode.png"
    },
    {
      image: "predictive.png"
    },
    {
      image: "chatbot.png"
    },
    {
      image: "datasharing.png"
    },
    {
      image: "scheduling.png"
    },
    {
      image: "sos.png"
    },
  ];

  const testimonials = [
    {
      name: "Alice Johnson",
      feedback:
        "Arogyam transformed the way I manage my health. Instant access to my medical records has been a lifesaver!",
      rating: 5,
    },
    {
      name: "Mark Benson",
      feedback:
        "The AI medical assistant is truly helpful! It gives me instant advice on my symptoms.",
      rating: 4,
    },
    {
      name: "Sophia Patel",
      feedback:
        "The QR-based patient card is a game-changer. My doctor gets all my medical history instantly!",
      rating: 5,
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
          <h1>{t('hero.title')}</h1>
          <p>
            <strong>Arogyam</strong> {t('hero.description')}
          </p>
          <a href="#features" className="cta-button">
            {t('hero.ctaButton')}
          </a>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="features-heading">{t('features.heading')}</h2>
        <div className="features-container">
          {featuresData.map((feature, index) => (
            <div key={index} className="feature-card">
              <img
                src={feature.image}
                alt={`Feature ${index + 1}`}
                className="feature-image"
              />
              <h3 className="feature-title">{t(`features.items.${index}.title`)}</h3>
              <p className="feature-description">{t(`features.items.${index}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chatbot Section */}
      <div className="chatbot-container">
        <div className="chatbot-card">
          <h2>
            <span className="highlight">{t('chatbot.title')}</span>
          </h2>
          <h4>{t('chatbot.subtitle')}</h4>
          <p>
            {t('chatbot.description')}
          </p>
          <button onClick={handleClick} className="get-started-button">
            <FaHeartbeat size={20} className="icon-left" />
            <span>{t('chatbot.button')}</span>
            <ChevronRight size={20} className="icon-right" />
          </button>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="testimonials-heading">{t('testimonials.heading')}</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img
                src={`https://i.pravatar.cc/150?img=${index + 5}`}
                alt={testimonial.name}
                className="testimonial-profile"
              />
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} color="#ffc107" />
                ))}
              </div>
              <p className="testimonial-feedback">{testimonial.feedback}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="appointment-section">
        <h2 className="appointment-heading">{t('appointment.heading')}</h2>
        <div className="appointment-container">
          {/* Main Content */}
          <div className="appointment-content">
            {/* Left Side - Text Section */}
            <div className="text-section">
              <h3 className="subheading">
                {t('appointment.subheading')}
              </h3>
              <p className="description">
                {t('appointment.description1')}
              </p>
              <p className="description">
                {t('appointment.description2')}
              </p>
              <a href="/signin" className="learn-more">
                {t('appointment.button')}
              </a>
            </div>

            {/* Right Side - Image */}
            <div className="person">
              <img src="bookapp.png" alt="Appointment" />
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section company">
            <h2>{t('footer.company.title')}</h2>
            <p>
              {t('footer.company.description')}
            </p>
          </div>

          <div className="footer-section links">
            <h2>{t('footer.quickLinks.title')}</h2>
            <ul>
              {t('footer.quickLinks.links', { returnObjects: true }).map((link, index) => (
                <li key={index}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section social">
            <h2>{t('footer.followUs.title')}</h2>
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="footer-section contact">
            <h2>{t('footer.contactUs.title')}</h2>
            <p>{t('footer.contactUs.email')}</p>
            <p>{t('footer.contactUs.phone')}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
