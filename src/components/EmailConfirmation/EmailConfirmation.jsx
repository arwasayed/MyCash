import React, { useState, useEffect, useRef } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./EmailConfirmation.css";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const { token: paramToken } = useParams(); 
  const location = useLocation();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const queryToken = params.get("token"); 
      const token = paramToken || queryToken; 
      console.log("URL received:", location.pathname + location.search); 

      if (!token) {
        setStatus("error");
        setMessage("رابط التفعيل غير صالح. التوكن غير موجود.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/user/verify-email/${token}`
, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Backend response:", data);

if (data.status === "success") {
  setStatus("success");
  setMessage("تم تفعيل حسابك بنجاح! 🎉 جاري توجيهك إلى الصفحة الرئيسية...");
  localStorage.setItem("token", data.data?.token); 
  setTimeout(() => {
    navigate("/home", { replace: true });
  }, 3000);
} else {
  setStatus("error");
  setMessage(data.message || "فشل تفعيل الحساب. الرابط غير صالح أو منتهي الصلاحية.");
}

      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("حدث خطأ أثناء تفعيل الحساب. حاول مرة أخرى لاحقًا.");
      }
    };

    verifyEmail();
  }, [paramToken, location.search, navigate]);

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <Container fluid className="forgot-container d-flex justify-content-center align-items-center">
      <div className="Confirm-box text-center rounded">
        <img src="/images/img (5).svg" alt="mail bot" className="img-fluid" style={{ maxHeight: "200px" }} />

        {status === "loading" && (
          <Alert variant="info">
            <span className="alert-icon">⏳</span>
            <span className="alert-text">جاري تفعيل الحساب...</span>
          </Alert>
        )}
        {status === "success" && (
          <>
            <Alert variant="success">
              <span className="alert-icon">✅</span>
              <span className="alert-text">{message}</span>
            </Alert>
            <p>🚀 دلوقتي كل مميزات ماي كاش مفتوحة ليك… يلا نبدأ نخطط وننطلق!</p>
          </>
        )}
        {status === "error" && (
          <Alert variant="danger">
            <span className="alert-icon">❌</span>
            <span className="alert-text">{message}</span>
          </Alert>
        )}

        {status !== "loading" && (
          <Button
            style={{
              backgroundColor: "#7C2DFF",
              border: "none",
              borderRadius: 12,
              padding: "12px 40px",
              color: "#fff",
              fontSize: 16,
              fontWeight: "600",
              cursor: "pointer",
              background: "linear-gradient(90deg, #8B5CF6 0%, #A855F7 25%, #C084FC 50%, #A855F7 75%, #8B5CF6 100%)",
            }}
            onClick={handleStart}
          >
            ابدأ الآن
          </Button>
        )}
      </div>
    </Container>
  );
};

export default EmailConfirmation;