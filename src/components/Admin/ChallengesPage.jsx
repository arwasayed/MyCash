import React, { useState } from "react";
import ManageChallenge from "./ManageChallenge/ManageChallenge";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChallengesPage = () => {
  const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", {
          state: { 
            from: "/challenge",
            message: "يجب تسجيل الدخول أولاً للوصول لصفحة الدفع" 
          }
        });
      }
    }, [navigate]);
  return (
    <div className="container py-5">      
      <ManageChallenge />
    </div>
  );
};

export default ChallengesPage;
