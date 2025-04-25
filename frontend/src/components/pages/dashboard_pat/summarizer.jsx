import React from "react";
import "../css files patient/summarizer.css";
import Userdashboardsidebar from "./userdashboardsidebar";

const Summarizer = () => {
  return (
    <div className="dashboard-container">
      <div className="left-sided">
        <Userdashboardsidebar />
      </div>
      <div className="main-content">
        <div className="summarizer-header">
          <h1>Medical Report Summarizer</h1>
        </div>
        
        <div className="summarizer-content-container">
          <div className="summarizer-upload-section">
            <div className="robot-image">
              <img src="/summarizerimg.png" alt="AI Medical Assistant" />
            </div>
            
            <div className="upload-container">
              <div className="coming-soon-message">
                <h2>Coming Soon!</h2>
                <p>
                  Our AI-powered medical report summarizer will be available soon. 
                  This feature will allow you to upload your medical reports and get 
                  instant AI-generated summaries to help you understand your medical information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
