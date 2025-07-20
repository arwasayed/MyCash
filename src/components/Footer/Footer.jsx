import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container py-4">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-title">عن التطبيق</h3>
          <p className="footer-description">
            ماي كاش هو تطبيقك الذكي لإدارة الأموال وتحقيق
            <br />
            الأهداف المالية بطريقة سهلة وممتعة
          </p>
        </div>
        {/* Quick Links Section */}
        {token ? (
          <div className="footer-section">
            <h3 className="footer-title">روابط سريعة</h3>
            <ul className="footer-links list-unstyled">
              <li>
                <span onClick={() => navigate("/home")} className="footer-link">
                  الصفحة الرئيسية
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/chatbot")}
                  className="footer-link"
                >
                  المساعد الذكي
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/reports")}
                  className="footer-link"
                >
                  التقارير
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/subscription")}
                  className="footer-link"
                >
                  الاشتراك
                </span>
              </li>
            </ul>
          </div>
        ) : null}

        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-title">تواصل معنا</h3>
          <div className="footer-social-icons">
            <a
              href="https://x.com/NadaSalahAhmed?t=s3m5K5wGBEoobWbFrG4kFg&s=09"
              target="_blank"
              className="footer-social-icon"
            >
              <img
                src="/public/footer/footer-icons/Twitter.svg"
                alt="Twitter"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.instagram.com/nada_abozeid?igsh=MWhxNXA4MzBxdzVweQ=="
              target="_blank"
              className="footer-social-icon"
            >
              <img
                src="/public/footer/footer-icons/Instgram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/nada-salah-abozeid/"
              target="_blank"
              className="footer-social-icon"
            >
              <img
                src="/public/footer/footer-icons/LinkedIn.svg"
                alt="LinkedIn"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
