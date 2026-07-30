import { useEffect, useState } from "react";
import { API_BASE } from "../../utils/api";

import Hero from "./landing/Hero";
import Features from "./landing/Features";
import HowItWorks from "./landing/HowItWorks";
import Stats from "./landing/Stats";
import Services from "./landing/Services";
import DoctorsPreview from "./landing/DoctorsPreview";
import Testimonials from "./landing/Testimonials";
import Emergency from "./landing/Emergency";
import ForProfessionals from "./landing/ForProfessionals";
import FAQ from "./landing/FAQ";
import Contact from "./landing/Contact";
import Footer from "./landing/Footer";

const Home = () => {
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    isHealthCardRegistered: false,
    isLoading: true,
  });

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setUserStatus({ isAuthenticated: false, isHealthCardRegistered: false, isLoading: false });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/health-card-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.ok ? await response.json() : null;
      setUserStatus({
        isAuthenticated: true,
        isHealthCardRegistered: Boolean(data?.isHealthCardRegistered),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error checking user status:", error);
      setUserStatus({ isAuthenticated: true, isHealthCardRegistered: false, isLoading: false });
    }
  };

  const handleGetStarted = () => {
    if (!userStatus.isAuthenticated) window.location.href = "/signin";
    else if (!userStatus.isHealthCardRegistered) window.location.href = "/scanner";
    else window.location.href = "/userdashboard";
  };

  return (
    <div className="min-h-screen bg-white font-sans dark:bg-surface-950">
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <HowItWorks />
      <Stats />
      <Services />
      <DoctorsPreview />
      <Testimonials />
      <Emergency />
      <ForProfessionals />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
