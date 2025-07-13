import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
     let called = false; 
    const verifyAccount = async () => {
        if (called) return; // إذا تم استدعاؤها سابقاً لا تنفذ مرة أخرى
    called = true;
      setLoading(true);
      setMessage(null);
      setError(null);


      try {
        const response = await fetch(
          `http://localhost:3000/api/user/EmailConfirmation/${token}`,
          {
            method: "GET", // أو POST حسب API عندك
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setMessage(data.message || "تم تفعيل الحساب بنجاح!");
          // توجيه المستخدم تلقائيًا بعد عدة ثواني مثلاً:
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setError(data.message || "فشل تفعيل الحساب، الرابط غير صالح أو منتهي.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تفعيل الحساب. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyAccount();
    } else {
      setError("الرابط غير صحيح.");
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="text-center p-4 shadow rounded" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-4">تفعيل الحساب</h3>

        {loading && <p>جاري تفعيل حسابك...</p>}

        {message && (
          <div className="custom-alert success mb-3">
            <span className="alert-icon">✅</span> {message}
          </div>
        )}

        {error && (
          <div className="custom-alert error mb-3">
            <span className="alert-icon">❌</span> {error}
          </div>
        )}

        <Button variant="primary" as={Link} to="/login">
          العودة لتسجيل الدخول
        </Button>
      </div>
    </Container>
  );
};

export default VerifyEmail;
