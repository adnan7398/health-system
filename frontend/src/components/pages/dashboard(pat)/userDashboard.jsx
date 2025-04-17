import React from "react";
import "../css files patient/userdashboard.css";
import UserSidebar from "./usersidebar"; // Right sidebar (User Profile)
import Userdashboardsidebar from "./userdashboardsidebar";

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Left Sidebar - Navigation Links */}
      <div className="left-sidebar">
        <Userdashboardsidebar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Your Medical Reports</h1>
        <p>
          Welcome to your dashboard. Manage your appointments and reports here.
        </p>
      </div>

      {/* Right Sidebar - User Profile */}
      <div className="right-sidebar">
        <UserSidebar />
      </div>
    </div>
  );
};

export default UserDashboard;
