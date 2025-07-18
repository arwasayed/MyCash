import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Image, Form, Button, ProgressBar } from 'react-bootstrap';
import axios from "axios"; 
const Navbar = () => {
  const [user, setUser] = useState({ nickname: 'صاحبى', email: 'sara.mahmoud@email.com', avatar: './jklj' });
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  // Update auth state when component mounts and when localStorage changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

        const response = await axios.get('http://localhost:3000/api/user/settings/me', {
          headers: { Authorization: `${token}` },
        });
        console.log(response);

        setUser({
          nickname: response.data.data.user.nickname,
          email: response.data.data.user.email,
          avatar: response.data.data.user.avatar || 'default-avatar.png',
        });
      } catch (err) {
        console.error("navخطأ في جلب بيانات المستخدم:", err.message);
        setError('navفشل جلب بيانات المستخدم');
      }
    };

    fetchUserData();

    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    // Check immediately
    checkAuth();

    // Listen for storage events
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event that we'll trigger after login
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // Dispatch custom event to notify other tabs/windows
    window.dispatchEvent(new Event("authChange"));
    navigate("/"); // Redirect to home page
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className="navbar navbar-expand-lg bg-white shadow-sm fixed-top d-none d-lg-flex"
        dir="rtl"
      >
        <div
          className="container-fluid d-flex align-items-center justify-content-between"
          style={{ direction: "rtl" }}
        >
          {/* Right Side - Brand Logo */}
          <div className="d-flex">
            <Link
              to={isAuthenticated ? "/home" : "/"}
              className="navbar-brand fw-bold"
              style={{
                color: "#6c5dd3",
                fontSize: "1.5rem",
                fontFamily: "Cairo",
              }}
            >
              ماي كاش
            </Link>
          </div>
          
          {/* Center - Navigation Links (only when authenticated) */}
          {isAuthenticated && (
            <div className="position-absolute start-50 translate-middle-x">
              <ul className="navbar-nav flex-row gap-4">
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
              </ul>
            </div>
          )}

          {/* Left Side - Auth Links */}
          <div className="d-flex">
            {!isAuthenticated ? (
              <div className="d-flex align-items-center">
                <Link
                  to="/login"
                  className="auth-link"
                  style={{ color: "#6c5dd3" }}
                >
                  تسجيل الدخول
                </Link>
                <span className="separator mx-2" style={{ color: "#6c5dd3" }}>
                  |
                </span>
                <Link
                  to="/register"
                  className="auth-link"
                  style={{ color: "#6c5dd3" }}
                >
                  إنشاء حساب
                </Link>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3 ms-auto">
                <Image
                src={
                  user.avatar.startsWith('http')
                    ? user.avatar
                    : user.avatar.startsWith('/')
                    ? `http://localhost:3000${user.avatar}?t=${Date.now()}`
                    : `/Uploads/${user.avatar}?t=${Date.now()}`
                }
                roundedCircle
                width={60}
                height={60}
                style={{ objectFit: 'cover' }}
              />
                <span className="icon-notification" title="الإشعارات">
                <Link className="nav-link" to="/notification">
                  🔔
                </Link>
                </span>
                <span className="icon-settings" title="الإعدادات">
                <Link className="nav-link" to="/account">
                    ⚙️
                </Link>
                </span>
                {/* <div className="d-flex align-items-center gap-3"> */}
                <button
                  onClick={handleLogout}
                  className="auth-link border-0 bg-transparent"
                  style={{ color: "#6c5dd3", cursor: "pointer" }}
                >
                  تسجيل خروج
                </button>
                {/* </div> */}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className="navbar bg-white shadow-sm fixed-top d-flex d-lg-none"
        dir="ltr"
      >
        <div className="container d-flex align-items-center justify-content-between">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            className="navbar-brand fw-bold"
            style={{
              color: "#6c5dd3",
              fontSize: "1.5rem",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            ماي كاش
          </Link>

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

        {/* Mobile Sidebar */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="sidebarNav"
          aria-labelledby="sidebarNavLabel"
          dir="ltr"
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
            {isAuthenticated && (
              <ul className="navbar-nav flex-column gap-3 mb-4">
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
              </ul>
            )}

            {!isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 justify-content-center">
                <Link to="/login" className="auth-link">
                  تسجيل الدخول
                </Link>
                <span className="separator">|</span>
                <Link to="/register" className="auth-link">
                  إنشاء حساب
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center gap-3 justify-content-center mt-3">
                <button
                  onClick={handleLogout}
                  className="auth-link border-0 bg-transparent mt-2"
                  style={{ color: "#6c5dd3", cursor: "pointer" }}
                >
                  تسجيل خروج
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
