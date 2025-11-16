import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import React from "react";
import AppLayout from "./components/layouts/app-layout";
import Home from "./components/pages/home";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import ErrorBoundary from "./components/utils/ErrorBoundary";

//auth routes
import Login from "./components/pages/authlogin/login";
import LoginDr from "./components/pages/authlogin/doctorlogin";

//patient routes
import Dashboard from "./components/pages/dashboard_pat/userDashboard";
import PatientAppointments from "./components/pages/dashboard_pat/patientappointments";
import BookAppointment from "./components/pages/dashboard_pat/bookappointment";
import Alldoctors from "./components/pages/dashboard_pat/alldoctors";
import PatientReport from "./components/pages/dashboard_pat/medicalReport";
import Chatbot from "./components/pages/dashboard_pat/chatbot";
import Caloriecalculator from "./components/pages/dashboard_pat/calorieconvertor";
import Fitness from "./components/pages/dashboard_pat/fitness";
import Summarizer from "./components/pages/dashboard_pat/summarizer";
import ArogyamCard from "./components/pages/dashboard_pat/arogyamcard";
import Qrform from "./components/pages/dashboard_pat/qrform";
import QRScanner from "./components/pages/dashboard_pat/qrscanner";
import SecretKey from "./components/pages/dashboard_pat/verifyauth";
import AadhaarRegistration from "./components/pages/dashboard_pat/aadhaarRegistration";
import CommonFacilities from "./components/pages/dashboard_pat/CommonFacilities";

//doctor routes
import DoctorDashboard from "./components/pages/dashboard_doc/doctor";
import Patient from "./components/pages/dashboard_doc/patients";
import Appointment from "./components/pages/dashboard_doc/appointments";
import Conference from "./components/pages/dashboard_doc/conference";
import HeartDisease from "./components/pages/dashboard_doc/heart-disease";
import BreastCancer from "./components/pages/dashboard_doc/breastcancer";
import Pneumonia from "./components/pages/dashboard_doc/pneumonia";
import Pcod from "./components/pages/dashboard_doc/pcod";
import Blogging from './components/pages/dashboard_pat/blogging';
// import { BaseLoggger } from "html5-qrcode/esm/core";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      //auth route
      { path: "/doctor/signin", element: <LoginDr /> },
      { path: "/doctorlogin", element: <LoginDr /> }, // Redirect for backward compatibility
      { path: "/signin", element: <Login /> },

      //patient routes (protected)
      { 
        path: "/chatbot", 
        element: <ProtectedRoute><Chatbot /></ProtectedRoute> 
      },
      { 
        path: "/register", 
        element: <ProtectedRoute><Qrform /></ProtectedRoute> 
      },
      { 
        path: "/scanner", 
        element: <ProtectedRoute isScannerRoute={true}><QRScanner /></ProtectedRoute> 
      },
      { 
        path: "/userdashboard", 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
      },
      { 
        path: "/auth", 
        element: <ProtectedRoute><SecretKey /></ProtectedRoute> 
      },
      { 
        path: "/arogyamcard", 
        element: <ProtectedRoute><ArogyamCard /></ProtectedRoute> 
      },
      { 
        path: "/aadhaar-registration", 
        element: <ProtectedRoute><AadhaarRegistration /></ProtectedRoute> 
      },
      { 
        path: "/bookappointment", 
        element: <ProtectedRoute><BookAppointment /></ProtectedRoute> 
      },
      { 
        path: "/calorieconvertor", 
        element: <ProtectedRoute><Caloriecalculator /></ProtectedRoute> 
      },
      { 
        path: "/fitness", 
        element: <ProtectedRoute><Fitness /></ProtectedRoute> 
      },
      { 
        path: "/summarizer", 
        element: <ProtectedRoute><Summarizer /></ProtectedRoute> 
      },
      { 
        path: "/patientreport", 
        element: <ProtectedRoute><PatientReport /></ProtectedRoute> 
      },
      { 
        path: "/medicalReport", 
        element: <ProtectedRoute><PatientReport /></ProtectedRoute> 
      },
      { 
        path: "/patientappointments", 
        element: <ProtectedRoute><PatientAppointments /></ProtectedRoute> 
      },
      { 
        path: "/alldoctors", 
        element: <ProtectedRoute><Alldoctors /></ProtectedRoute> 
      },
      { 
        path: "/blogging", 
        element: <ProtectedRoute><Blogging /></ProtectedRoute> 
      },
      { 
        path: "/common-facilities", 
        element: <ProtectedRoute><CommonFacilities /></ProtectedRoute> 
      },

      //doctor routes (protected)
      { 
        path: "/doctordashboard", 
        element: <ProtectedRoute><DoctorDashboard /></ProtectedRoute> 
      },
      { 
        path: "/patient", 
        element: <ProtectedRoute><Patient /></ProtectedRoute> 
      },
      { 
        path: "/appointment", 
        element: <ProtectedRoute><Appointment /></ProtectedRoute> 
      },
      { 
        path: "/conference", 
        element: <ProtectedRoute><Conference /></ProtectedRoute> 
      },
      { 
        path: "/breastcancer", 
        element: <ProtectedRoute><BreastCancer /></ProtectedRoute> 
      },
      { 
        path: "/heartdisease", 
        element: <ProtectedRoute><HeartDisease /></ProtectedRoute> 
      },
      { 
        path: "/pcod", 
        element: <ProtectedRoute><Pcod /></ProtectedRoute> 
      },
      { 
        path: "/pneumonia", 
        element: <ProtectedRoute><Pneumonia /></ProtectedRoute> 
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
