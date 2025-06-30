import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm fixed-top"
      dir="rtl"
    >
      <div className="container d-flex align-items-center">
        {/* Brand on the right */}
        <a
          className="navbar-brand fw-bold order-1"
          style={{
            color: "#6c5dd3",
            fontSize: "1.5rem",
            fontFamily: "Cairo, sans-serif",
          }}
          href="#"
        >
          ماي كاش
        </a>
        {/* Nav links centered */}
        <ul className="navbar-nav flex-row gap-3 order-2 mx-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">
              الصفحة الرئيسية
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              المساعد الذكي
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              أهدافي
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              خطتي
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              التقارير
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              الاشتراكات
            </a>
          </li>
        </ul>
        {/* Auth links on the left */}
        <div className="d-flex align-items-center gap-2 order-3 ms-auto">
          <a href="#" className="auth-link">
            تسجيل الدخول
          </a>
          <span className="separator">|</span>
          <Link to="/register" className="auth-link">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
