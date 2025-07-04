import React, { useState } from "react";
import "./Register.css";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserIcon from "../../../public/Register2/icons/Frame.svg";
import MailIcon from "../../../public/Register2/icons/Frame (1).svg";
import PassIcon from "../../../public/Register2/icons/Frame (2).svg";
import AppearPassIcon from "../../../public/Register2/icons/AppearPass.svg";

const SignupSection = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,passwordConfirm: confirmPassword, nickname: fullName }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Response: ${text}`
        );
      }
      const data = await response.json();
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Container fluid className="responsive-container">
      <div className="custom-div content-wrapper">
        <div className="register-form">
          <div className="form-header">
            <h1 className="form-title">💸 !يلا نبدأ نوفر سوا</h1>
            <p className="form-subtitle">
              انضم لآلاف المستخدمين واحصل على تحكم كامل في أموالك
            </p>
          </div>

          <Form onSubmit={handleSignup} className="register">
            <Form.Group className="position-relative input-with-icon icon">
              <Form.Label className="">الاسم الكامل</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
                  <img
                  src={UserIcon}
                  alt="lock"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "65%",
                    transform: "translateY(-100%)",
                    width: 24,
                    height: 24,
                    pointerEvents: "none",
                  }}
                />

              <br />
            </Form.Group>

            <Form.Group className="mb-3 position-relative input-with-icon icon">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img
                  src={MailIcon}
                  alt="lock"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "65%",
                    transform: "translateY(-50%)",
                    width: 24,
                    height: 24,
                    pointerEvents: "none",
                  }}
                />

            </Form.Group>

            <Form.Group className="mb-3 position-relative input-with-icon">
              <Form.Label>كلمة المرور</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة مرور قوية"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                {/* Lock icon (always visible, right side) */}
                <img
                  src={PassIcon}
                  alt="lock"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 24,
                    height: 24,
                    pointerEvents: "none",
                  }}
                />
                {/* Show/hide icon (eye), clickable, left side */}
                <img
                  src={AppearPassIcon}
                  alt="show/hide password"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    width: 24,
                    height: 24,
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 position-relative input-with-icon">
              <Form.Label>تأكيد كلمة المرور</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                {/* Lock icon (always visible, right side) */}
                <img
                  src={PassIcon}
                  alt="lock"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 24,
                    height: 24,
                    pointerEvents: "none",
                  }}
                />
                {/* Show/hide icon (eye), clickable, left side */}
                <img
                  src={AppearPassIcon}
                  alt="show/hide confirm password"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    width: 24,
                    height: 24,
                  }}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 form-check" dir="rtl">
              <Form.Check
                type="checkbox"
                label={
                  <span>
                    أوافق على
                    <a href="#" className="terms-link">
                      {" "}
                      الشروط والأحكام وسياسة الخصوصية
                    </a>
                  </span>
                }
              />
              <br />
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

            <Button variant="primary" className="register-button" type="submit">
              <p>← إنشاء حساب جديد</p>
            </Button>
          </Form>
          <div>
   <Button variant="primary" className="Google-button" type="submit">
              <p> <img src="/images/devicon_google (1).svg"/>  Google تسجيل باستخدام </p>
            </Button>
            </div>
          <p className="login-text">
            تسجيل الدخول
            <Link to="/login" className="login-link">
              {" "}
              لديك حساب بالفعل؟
            </Link>
          </p>
        </div>

        <div className="welcome-content">
          <div className="welcome-gradient">
            <img
              src="/public/Register2/images/img.svg"
              alt="Welcome illustration"
              className="welcome-image"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignupSection;
