import React, { useState, useEffect } from "react";
import "./Register.css";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "/Register2/icons/Frame.svg";
import MailIcon from "/Register2/icons/Frame (1).svg";
import PassIcon from "/Register2/icons/Frame (2).svg";
import AppearPassIcon from "/Register2/icons/AppearPass.svg";

const SignupSection = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // تحميل مكتبة Google Sign-In
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignUp,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignUpButton"),
        {
          theme: "outline",
          size: "large",
          text: "signup_with",
          shape: "pill",
          logo_alignment: "left",
        }
      );
    }
  }, []);

  const handleGoogleSignUp = async (response) => {
    try {
      const res = await fetch("http://localhost:3000/api/user/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          credential: response.credential,
          mode: "register",
        }),
      });
      const data = await res.json();
      console.log("Google Sign-Up response:", data); // تسجيل الاستجابة
      if (data.status === "success") {
        setSuccess(data.message);
        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
        }
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء التسجيل بجوجل. حاول مرة أخرى.");
      console.error("Google Sign-Up error:", err);
    }
  };

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          email,
          password,
          passwordConfirm: confirmPassword,
          nickname: fullName,
        }),
      });
      const data = await response.json();
      console.log("Signup response:", data); // تسجيل الاستجابة
      if (data.status === "success") {
        setSuccess(data.message);
        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
        }
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "فشل التسجيل. حاول مرة أخرى.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
      console.error("Signup error:", err);
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
                alt="user"
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
                alt="mail"
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
                    <Link to="/terms" className="terms-link">
                      {" "}
                      الشروط والأحكام وسياسة الخصوصية
                    </Link>
                  </span>
                }
              />
            </Form.Group>

            {success && (
              <Alert variant="success">
                <span className="alert-icon">✅</span>
                <span className="alert-text">{success}</span>
              </Alert>
            )}

            {error && (
              <Alert variant="danger">
                <span className="alert-icon">❌</span>
                <span className="alert-text">{error}</span>
              </Alert>
            )}

            <Button variant="primary" className="register-button" type="submit">
              <p>← إنشاء حساب جديد</p>
            </Button>

            <div id="googleSignUpButton">
              <Button
                variant="primary"
                className="Google-button"
                type="button"
                onClick={() => window.google.accounts.id.prompt()}
              >
                <p>
                  <img src="/images/devicon_google (1).svg" alt="Google icon" />{" "}
                  تسجيل باستخدام Google
                </p>
              </Button>
            </div>

            <p className="login-text">
              <Link to="/login" className="login-link">
                تسجيل الدخول
              </Link>{" "}
              لديك حساب بالفعل؟
            </p>
          </Form>
        </div>

        <div className="welcome-content">
          <div className="welcome-gradient">
            <img
              src="/images/img.jpg"
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
