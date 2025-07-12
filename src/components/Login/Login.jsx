import React, { useState } from "react";
import "./login.css";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.status === "success") {
        setSuccess(data.message);
        localStorage.setItem("token", data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-wrapper">
        <div className="login-form-box">
          <div className="login-header">
            <h1 className="login-title">مرحبًا بعودتك 👋</h1>
            <p className="login-subtitle">قم بتسجيل الدخول للوصول إلى حسابك</p>
          </div>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3 position-relative login-input-group">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img
                src="/images/Frame (1).svg"
                alt="user icon"
                className="login-icon"
              />
            </Form.Group>

            <Form.Group className="mb-3 position-relative login-input-group">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة مرور قوية"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src="/images/Frame (2).svg"
                alt="lock icon"
                className="login-icon"
              />
            </Form.Group>

            <div className="mb-3" dir="rtl">
              <div
                className="d-flex justify-content-between align-items-center w-100"
                style={{ maxWidth: "300px" }}
              >
                <div className="form-check d-flex align-items-center m-0">
                  <input
                    className="form-check-input ms-2"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label
                    className="form-check-label custom-form-check-label "
                    htmlFor="rememberMe"
                  >
                    تذكرني
                  </label>
                </div>
                <Link to="/ForgetPassword" className="custom-link login-link">
                  نسيت كلمة السر؟
                </Link>
              </div>
            </div>
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

            <Button variant="primary" className="login-button" type="submit">
              <p>تسجيل الدخول</p>
            </Button>
          </Form>

          <div>
            <Button variant="primary" className="Google-button" type="submit">
              <p>
                {" "}
                تسجيل باستخدام Google
                <img src="/images/devicon_google (1).svg" />{" "}
              </p>
            </Button>
          </div>

          <span className="newaccount">
            <Link to="/register" className="login-link">
              إنشاء حساب جديد
            </Link>{" "}
            ليس لديك حساب؟
          </span>
        </div>

        <div className="login-image-box">
          <div className="login-gradient-box">
            <img
              src="/images/img (1).svg"
              alt="Welcome illustration"
              className="login-image"
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div>
              <h2 className="welcomeback">أهلاً بعودتك إلى ماي كاش</h2>
              <p className="welcome-back">
                تابع رحلتك في إدارة أموالك بذكاء وسهولة
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
