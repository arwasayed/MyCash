import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

// يمكنك استبدال هذا المتغير لاحقاً بـ context أو redux أو أي نظام مصادقة
const isAuthenticated = false; // غيّر إلى true لتجربة شكل Navbar بعد الدخول

const Navbar = () => {
  return (
    <>
      {/* Top Navbar for large screens */}
      <nav
        className="navbar navbar-expand-lg bg-white shadow-sm fixed-top d-none d-lg-flex"
        dir="rtl"
      >
        <div className="container-fluid d-flex align-items-center" style={{ direction: "rtl" }}>
          {/* Brand at far right */}
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
<<<<<<< HEAD

          {/* Centered nav links */}
          <div className="flex-grow-1 d-flex justify-content-center">
            <ul className="navbar-nav flex-row gap-4">
              <li className="nav-item"><Link className="nav-link" to="/home">الصفحة الرئيسية</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/assistant">المساعد الذكي</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/goals">أهدافي</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/game">الألعاب</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/planebudget">خطتي</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reports">التقارير</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/subscription">الاشتراكات</Link></li>
=======
          {/* Nav links centered */}
          <div className="flex-grow-1 d-flex justify-content-center">
            <ul className="navbar-nav flex-row gap-3 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li className="nav-item">
                 <Link className="nav-link" to="/chatbot">
                  المساعد الذكي
                </Link>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="#">
                  أهدافي
                  </a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/planebudget">
                  خطتي
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reports">
                  التقارير
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/subscription">
                  الاشتراكات
                </Link>
              </li>
>>>>>>> 858bd3ebb9abd17741101104e0803407a1e9aa65
            </ul>
          </div>

          {/* Auth links at far left */}
          {!isAuthenticated ? (
            <div className="d-flex align-items-center ms-auto">
              <Link to="/login" className="auth-link" style={{ color: "#6c5dd3" }}>
                تسجيل الدخول
              </Link>
              <span className="separator mx-2" style={{ color: "#6c5dd3" }}>|</span>
              <Link to="/register" className="auth-link" style={{ color: "#6c5dd3" }}>
                إنشاء حساب
              </Link>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3 ms-auto">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <span className="icon-notification" title="الإشعارات">🔔</span>
              <span className="icon-globe" title="اللغة">🌐</span>
              <span className="icon-settings" title="الإعدادات">⚙️</span>
            </div>
          )}
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
<<<<<<< HEAD
                <Link className="nav-link" to="/assistant">
=======
               <Link className="nav-link" to="/chatbot">
>>>>>>> 858bd3ebb9abd17741101104e0803407a1e9aa65
                  المساعد الذكي
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/goals">
                  أهدافي
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/game">
                  الألعاب
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reports">
                  خطتي
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reports">
                  التقارير
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/planebudget">
                  ظبط الميزانية
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  الاشتراكات
                </a>
              </li>
            </ul>
            {!isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 justify-content-center">
                <a href="/login" className="auth-link">
                  تسجيل الدخول
                </a>
                <span className="separator">|</span>
                <Link to="/register" className="auth-link">
                  إنشاء حساب
                </Link>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3 justify-content-center mt-3">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User"
                  style={{ width: 32, height: 32, borderRadius: "50%" }}
                />
                <span className="icon-notification" title="الإشعارات">🔔</span>
                <span className="icon-globe" title="اللغة">🌐</span>
                <span className="icon-settings" title="الإعدادات">⚙️</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
