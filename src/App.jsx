import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Register2 from "./components/Register2/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";
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
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
