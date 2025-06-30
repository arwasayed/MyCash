import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Register2 from "./components/Register2/Register.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register2 />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
