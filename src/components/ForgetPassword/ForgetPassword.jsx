import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import axios from "axios";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/forgot-password",
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.status === "success") {
        setMessage(
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
        );
        setTimeout(() => {
          navigate("/ResetPassword", { state: { email } });
        }, 2000);
      } else {
        setError(
          response.data.message || "حدث خطأ أثناء إرسال الرابط. حاول مرة أخرى."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء إرسال الرابط. حاول مرة أخرى."
      );
    }
  };

  return (
    <Container
      fluid
      className="forgot-container d-flex justify-content-center align-items-center"
    >
      <div className="forgot-box text-center rounded">
        <img
          src="/images/img (2).svg"
          alt="mail bot"
          className="img-fluid"
          style={{ maxHeight: "200px" }}
        />
        <div className="shadow p-5">
          <div className="Forget-pass">
            <p className="mb-2">نسيت كلمة السر؟ 😅</p>
            <p className="text-muted">
              مفيش مشكلة، اكتب إيميلك وهنبعتلك رابط تعيين كلمة مرور جديدة 📩
            </p>
          </div>
          <Form onSubmit={handleSubmit} className="mt-3 text-end">
            <Form.Group
              controlId="formEmail"
              className="position-relative mb-3"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  padding: 0,
                  margin: 0,
                }}
                className="email-box"
              >
                <img
                  src="/images/Frame (3).svg"
                  alt="email icon"
                  style={{
                    width: "20px",
                    height: "20px",
                    opacity: 0.7,
                    marginRight: 10,
                    marginLeft: 5,
                    padding: 0,
                    display: "block",
                  }}
                />
                <Form.Label
                  className="mb-0"
                  style={{
                    margin: 0,
                    padding: 0,
                    lineHeight: "20px",
                    fontSize: "14px",
                    fontWeight: 400,
                    fontFamily: "Cairo, sans-serif",
                  }}
                >
                  البريد الإلكتروني
                </Form.Label>
              </div>
              <Form.Control
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 send"
                required
              />
            </Form.Group>
            {message && (
              <div className="custom-alert success">
                <span className="alert-icon">✅</span>
                <span className="alert-text">{message}</span>
              </div>
            )}

            {error && (
              <div className="custom-alert error">
                <span className="alert-icon">❌</span>
                <span className="alert-text">{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-100 submit">
              إرسال الرابط
            </Button>
          </Form>
          <div className="mt-3">
            <Link to="/login" className="text-decoration-none backLogin">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
