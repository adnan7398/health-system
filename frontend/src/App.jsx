import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import React from "react";
import AppLayout from "./components/layouts/app-layout";
import Home from "./components/pages/home";

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

//doctor routes
import DoctorDashboard from "./components/pages/dashboard_doc/doctor";
import Patient from "./components/pages/dashboard_doc/patients";
import Appointment from "./components/pages/dashboard_doc/appointments";
import Conference from "./components/pages/dashboard_doc/conference";
import HeartDisease from "./components/pages/dashboard_doc/heart-disease";
import BreastCancer from "./components/pages/dashboard_doc/breastcancer";
import Pneumonia from "./components/pages/dashboard_doc/pneumonia";
import Pcod from "./components/pages/dashboard_doc/pcod";
import Blogging from './components/pages/dashboard-pat/blogging.jsx';
import { BaseLoggger } from "html5-qrcode/esm/core";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      //auth route
      { path: "/doctor/signin", element: <LoginDr /> },
      { path: "/signin", element: <Login /> },

      //patient route
      { path: "/chatbot", element: <Chatbot /> },
      { path: "/register", element: <Qrform /> },
      { path: "/scanner", element: <QRScanner /> },
      { path: "/userdashboard", element: <Dashboard /> },
      { path: "/auth", element: <SecretKey /> },
      { path: "/arogyamcard", element: <ArogyamCard /> },
      { path: "/bookappointment", element: <BookAppointment /> },
      { path: "/calorieconvertor", element: <Caloriecalculator /> },
      { path: "/fitness", element: <Fitness /> },
      { path: "/summarizer", element: <Summarizer /> },
      { path: "/patientreport", element: <PatientReport /> },
      { path: "/patientappointments", element: <PatientAppointments /> },
      { path: "/alldoctors", element: <Alldoctors /> },

      //doctor routes

      { path: "/doctordashboard", element: <DoctorDashboard /> },
      { path: "/patient", element: <Patient /> },
      { path: "/appointment", element: <Appointment /> },
      { path: "/conference", element: <Conference /> },
      { path: "/breastcancer", element: <BreastCancer /> },
      { path: "/heartdisease", element: <HeartDisease /> },
      { path: "/pcod", element: <Pcod /> },
      { path: "/pneumonia", element: <Pneumonia /> },
      { path: "/blogging", element: <Blogging/> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
