import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}

export default App;
