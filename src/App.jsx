import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Register2 from "./components/Register2/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";
import ForgotPassword from "./components/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import ResetPassword2 from "./components/ResentPasswor2/ResetPassword2.jsx";
import EmailConfirmation from "./components/EmailConfirmation/EmailConfirmation.jsx";
import EmailConfirm1 from "./components/EmailConfirm1/EmailConfirm1.jsx";
import Subscription from "./components/subscription/subscription.jsx";
import Account from './components/Account/Account.jsx';
import Notification from './components/Notification/Notification.jsx';
import Reports from "./components/Reports/Reports.jsx";
import PlaneBudget from "./components/PlaneBudget/PlaneBudget.jsx";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail.jsx"
import Rename from "./components/Rename/Rename.jsx";
import Chatbot from "./components/Chatbote/Chatbot.jsx"
import Payment from "./components/Payment/Payment.jsx"
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
<Route path="/EmailConfirmation/:token" element={<EmailConfirmation />} /><Route path="/verify-email/:token" element={<VerifyEmail />} />

          
          <Route path="/EmailConfirm1" element={<EmailConfirm1/>}/>
          <Route path="/subscription" element={<Subscription/>}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/notification" element={<Notification/>}/>
          <Route path="/reports" element={<Reports />} />
          <Route path="/planebudget" element={<PlaneBudget />} />
<Route path="/rename" element={<Rename/>}/>

<Route path="/chatbot" element={<Chatbot/>}/>
<Route path="/payment" element={<Payment/>}/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
