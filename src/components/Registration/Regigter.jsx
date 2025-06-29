import React, { useState } from "react";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="register-page">
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Side - Form */}
          <div className="col-lg-6 col-md-7 d-flex align-items-center justify-content-center">
            <div className="register-form-container">
              <div className="text-center mb-4">
                <h2 className="register-title">إنشاء حساب</h2>
                <p className="register-subtitle">
                  يلا نبدأ رحلة إدارة الأموال معاً
                </p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الأول"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      اسم العائلة
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم العائلة"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم هاتفك"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="أعد إدخال كلمة المرور"
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="agreeToTerms">
                      أوافق على{" "}
                      <a href="#" className="terms-link">
                        الشروط والأحكام
                      </a>{" "}
                      و{" "}
                      <a href="#" className="terms-link">
                        سياسة الخصوصية
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 register-btn"
                >
                  إنشاء حساب جديد
                </button>

                <div className="text-center mt-4">
                  <p className="login-link">
                    لديك حساب بالفعل؟{" "}
                    <a href="#" className="link-primary">
                      تسجيل الدخول
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="col-lg-6 col-md-5 d-none d-md-flex align-items-center justify-content-center register-illustration">
            <div className="illustration-container">
              <div className="illustration-card">
                <img
                  src="/public/Register/Image/mainimageRegister.png"
                  alt="Financial Management Illustration"
                  className="img-fluid rounded-4"
                />
              </div>
              <div className="floating-elements">
                <div className="floating-icon icon-1">💰</div>
                <div className="floating-icon icon-2">📊</div>
                <div className="floating-icon icon-3">🎯</div>
                <div className="floating-icon icon-4">💡</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="register-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="footer-item">
                <div className="footer-icon">🛡️</div>
                <h6>أمان عالي</h6>
                <p>بياناتك محمية بأعلى معايير الأمان</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="footer-item">
                <div className="footer-icon">⚡</div>
                <h6>سرعة فائقة</h6>
                <p>تجربة سريعة وسلسة في جميع الأوقات</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="footer-item">
                <div className="footer-icon">🎯</div>
                <h6>دقة عالية</h6>
                <p>تتبع دقيق لجميع معاملاتك المالية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
