import React from "react";
import "./Footer.css";

const Footer = () => {
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
        <div className="footer-section">
          <h3 className="footer-title">روابط سريعة</h3>
          <ul className="footer-links list-unstyled">
            <li>
              <a href="#" className="footer-link">
                الصفحة الرئيسية
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                المساعد الذكي
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                التقارير
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                الاشتراك
              </a>
            </li>
          </ul>
        </div>
        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-title">تواصل معنا</h3>
          <div className="footer-social-icons">
            <a href="#" className="footer-social-icon">
              <img
                src="/public/footer/footer-icons/Twitter.svg"
                alt="Twitter"
                width={20}
                height={20}
              />
            </a>
            <a href="#" className="footer-social-icon">
              <img
                src="/public/footer/footer-icons/Instgram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
            <a href="#" className="footer-social-icon">
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
