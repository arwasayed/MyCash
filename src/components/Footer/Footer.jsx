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
          <div className="social-links d-flex justify-content-center gap-4 mt-4">
            <a href="#" className="social-link twitter" aria-label="Twitter">
              {/* Twitter Brand SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="16" fill="#E5E7EB" />
                <path
                  d="M25 11.5a6.5 6.5 0 0 1-1.89.52 3.3 3.3 0 0 0 1.44-1.81 6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 16 14.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 8.5 10.5a3.28 3.28 0 0 0 1.01 4.37 3.28 3.28 0 0 1-1.48-.41v.04a3.28 3.28 0 0 0 2.63 3.22 3.3 3.3 0 0 1-.86.11c-.21 0-.42-.02-.62-.06a3.28 3.28 0 0 0 3.06 2.28A6.58 6.58 0 0 1 7 22.07a9.29 9.29 0 0 0 5.03 1.47c6.04 0 9.35-5 9.35-9.34 0-.14 0-.28-.01-.42A6.7 6.7 0 0 0 25 11.5z"
                  fill="#1da1f2"
                />
              </svg>
            </a>

            <a
              href="#"
              className="social-link instagram"
              aria-label="Instagram"
            >
              {/* Instagram Brand SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="16" fill="#E5E7EB" />
                <defs>
                  <radialGradient
                    id="ig"
                    cx="16"
                    cy="16"
                    r="16"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#feda75" />
                    <stop offset="0.5" stop-color="#fa7e1e" />
                    <stop offset="1" stop-color="#d62976" />
                  </radialGradient>
                </defs>
                <rect
                  x="9"
                  y="9"
                  width="14"
                  height="14"
                  rx="7"
                  fill="url(#ig)"
                />
                <circle cx="16" cy="16" r="4" fill="#fff" />
                <circle cx="21" cy="11" r="1" fill="#fff" />
              </svg>
            </a>
            <a href="#" className="social-link linkedin" aria-label="LinkedIn">
              {/* LinkedIn Brand SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="16" fill="#E5E7EB" />
                <path
                  d="M12.667 13.333h-2V22h2v-8.667zm-1-1.333a1.167 1.167 0 1 1 0-2.333 1.167 1.167 0 0 1 0 2.333zm3.333 1.333h-2V22h2v-4.333c0-1.167.667-1.667 1.333-1.667.667 0 1.333.5 1.333 1.667V22h2v-4.667c0-2-1.167-2.667-2.333-2.667-1.167 0-1.667.667-2 1.167V13.333z"
                  fill="#0077b5"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
