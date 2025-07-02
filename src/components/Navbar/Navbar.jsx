import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* Top Navbar for large screens */}
      <nav
        className="navbar navbar-expand-lg bg-white shadow-sm fixed-top d-none d-lg-flex"
        dir="rtl"
      >
        <div className="container d-flex align-items-center">
          {/* Brand on the right */}
          <Link
            to="/"
            className="navbar-brand fw-bold"
            style={{
              color: "#6c5dd3",
              fontSize: "1.5rem",
              fontFamily: "Cairo",
            }}
          >
            ماي كاش
          </Link>
          {/* Nav links centered */}
          <div className="flex-grow-1 d-flex justify-content-center">
            <ul className="navbar-nav flex-row gap-3 mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/home">
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
          </div>
          {/* Auth links on the left */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            <a href="/login" className="auth-link">
              تسجيل الدخول
            </a>
            <span className="separator">|</span>
            <Link to="/register" className="auth-link">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar (Offcanvas) for small screens */}
      <nav
        className="navbar bg-white shadow-sm fixed-top d-flex d-lg-none"
        dir="rtl"
      >
        <div className="container d-flex align-items-center flex-row-reverse">
          {/* Brand */}
          <Link
            to="/"
            className="navbar-brand fw-bold"
            style={{
              color: "#6c5dd3",
              fontSize: "1.5rem",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            ماي كاش
          </Link>
          {/* Sidebar toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarNav"
            aria-controls="sidebarNav"
            aria-label="Toggle sidebar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        {/* Offcanvas Sidebar */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="sidebarNav"
          aria-labelledby="sidebarNavLabel"
          dir="rtl"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="sidebarNavLabel">
              ماي كاش
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav flex-column gap-3 mb-4">
              <li className="nav-item">
                <a className="nav-link" href="/home">
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
            <div className="d-flex align-items-center gap-2 justify-content-center">
              <a href="/login" className="auth-link">
                تسجيل الدخول
              </a>
              <span className="separator">|</span>
              <Link to="/register" className="auth-link">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
