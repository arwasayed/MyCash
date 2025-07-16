import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51RlFaEGarrDO83raWOI8VILhcZumYSWdiqXH2o0Z4UAjMUykoofujw3qkMbCE7L7mm0SpWa3gZZqhbGAgFCUJ8qb00lk0ZMuqI");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
    </BrowserRouter>
  </React.StrictMode>
);
