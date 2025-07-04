import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Register2 from "./components/Register2/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";
import  ForgotPassword from'./components/ForgetPassword/ForgetPassword.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx'
import ResetPassword2 from './components/ResentPasswor2/ResetPassword2.jsx';
import EmailConfirmation from './components/EmailConfirmation/EmailConfirmation.jsx';
import EmailConfirm1 from './components/EmailConfirm1/EmailConfirm1.jsx';

import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register2 />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword/>}/>
          <Route path="/ResetPassword2/:token" element={<ResetPassword2/>}/>
          <Route path="/EmailConfirmation" element={<EmailConfirmation/>}/>
          <Route path="/EmailConfirm1" element={<EmailConfirm1/>}/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
