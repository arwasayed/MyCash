import React, { useState, useEffect } from "react";
import "./Register.css";
import { Container, Form, Button } from "react-bootstrap";
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

  // أخطاء لكل حقل بشكل منفصل
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [agreeTermsError, setAgreeTermsError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

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

  // دالة التحقق من صحة الإيميل (Regex بسيط)
  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleGoogleSignUp = async (response) => {
    try {
      // مسح الأخطاء السابقة
      setEmailError("");
      setError("");
      setSuccess("");

      const res = await fetch("http://localhost:3000/api/user/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          credential: response.credential,
          mode: "register",
        }),
      });
      const data = await res.json();
      console.log("Google Sign-Up response:", data);
      if (data.status === "success") {
        setSuccess(data.message);
        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
        }
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        if (data.message && (data.message.toLowerCase().includes("email") || data.message.includes("موجود"))) {
          setEmailError(data.message);
        } else {
          setError(data.message);
        }
      }
    } catch (err) {
      setError("حدث خطأ أثناء التسجيل بجوجل. حاول مرة أخرى.");
      console.error("Google Sign-Up error:", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // مسح الأخطاء القديمة
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setAgreeTermsError("");
    setError("");
    setSuccess("");

    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError("يرجى إدخال الاسم الكامل.");
      hasError = true;
    }
    if (!email.trim() || !validateEmail(email)) {
      setEmailError("يرجى إدخال بريد إلكتروني صالح.");
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("كلمتا المرور غير متطابقتين.");
      hasError = true;
    }
    if (!agreeTerms) {
      setAgreeTermsError("يجب الموافقة على الشروط والأحكام.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          email,
          password,
          passwordConfirm: confirmPassword,
          nickname: fullName,
        }),
      });
      const data = await response.json();
      console.log("Signup response:", data);

      if (data.status === "success") {
        setSuccess(data.message);
        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
        }
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        // لو السيرفر قال إن الإيميل موجود
        if (data.message && (data.message.toLowerCase().includes("email") || data.message.includes("موجود"))) {
          setEmailError(data.message);
        } else {
          setError(data.message || "فشل التسجيل. حاول مرة أخرى.");
        }
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
            <Form.Group className="position-relative input-with-icon icon mb-3">
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
              {fullNameError && (
                <div style={{ color: "red", fontSize: "0.9rem", marginTop: 5 }}>
                  {fullNameError}
                </div>
              )}
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
              {emailError && (
                <div style={{ color: "red", fontSize: "0.9rem", marginTop: 5 }}>
                  {emailError}
                </div>
              )}
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
              {passwordError && (
                <div style={{ color: "red", fontSize: "0.9rem", marginTop: 5 }}>
                  {passwordError}
                </div>
              )}
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
              {confirmPasswordError && (
                <div style={{ color: "red", fontSize: "0.9rem", marginTop: 5 }}>
                  {confirmPasswordError}
                </div>
              )}
            </Form.Group>
<Form.Group
  className="mb-3 form-check"
  dir="rtl"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginBottom: 10,
  }}
>
  {/* input عادي بدلاً من Form.Check */}
  <input
    type="checkbox"
    checked={agreeTerms}
    onChange={(e) => setAgreeTerms(e.target.checked)}
    style={{ width: "16px", height: "16px", cursor: "pointer" }}
  />
  
  <span style={{ whiteSpace: "nowrap", fontSize: "0.95rem" }}>
    أوافق على{" "}
    <Link to="/terms" className="terms-link">
      الشروط والأحكام وسياسة الخصوصية
    </Link>
  </span>
</Form.Group>

{agreeTermsError && (
  <div style={{ color: "red", fontSize: "0.9rem", marginTop: 5, textAlign: "center" }}>
    {agreeTermsError}
  </div>
)}





            {error && (
              <div
                style={{
                  color: "red",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* عرض رسالة النجاح */}
            {success && (
              <div
                style={{
                  color: "green",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                ✅ {success}
              </div>
            )}

            <Button variant="primary" className="register-button " style={{color:'#ffffff'}} type="submit">
              <p>← إنشاء حساب جديد</p>
            </Button>

            <div id="googleSignUpButton" style={{ marginTop: 20 }}>
              {/* زر Google SignUp مُصمم بواسطة Google SDK + زر إضافي للتجربة */}
              <Button
                variant="primary"
                className="Google-button"
                type="button"
                onClick={() => window.google.accounts.id.prompt()}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <img
                  src="/images/devicon_google (1).svg"
                  alt="Google icon"
                  style={{ width: 20, height: 20 }}
                />{" "}
                تسجيل باستخدام Google
              </Button>
            </div>

            <p className="login-text" style={{ marginTop: 20 }}>
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
