import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Image, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState({
    nickname: 'صاحبى',
    email: 'sara.mahmoud@email.com',
    avatar: './jklj',
    role: 'user'
  });
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  // جلب بيانات المستخدم
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

      const response = await axios.get('http://localhost:3000/api/user/settings/me', {
        headers: { Authorization: `${token}` },
      });
      const userrole = JSON.parse(localStorage.getItem('user'))?.role;

      setUser({
        nickname: response.data.data.user.nickname,
        email: response.data.data.user.email,
        avatar: response.data.data.user.avatar || 'default-avatar.png',
        role: userrole || 'user'
      });
      setImageError(false);
    } catch (err) {
      console.error("خطأ في جلب بيانات المستخدم:", err.message);
      setError('فشل جلب بيانات المستخدم');
    }
  };

  // تحديث حالة التوثيق وبيانات المستخدم
useEffect(() => {
  fetchUserData();

  // جلب البيانات كل 30 ثانية
  const interval = setInterval(fetchUserData, 1000);

  const checkAuth = () => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(prev => ({
        ...prev,
        role: userData.role || 'user'
      }));
    }
  };

  checkAuth();

  window.addEventListener("storage", checkAuth);
  window.addEventListener("authChange", checkAuth);

  return () => {
    clearInterval(interval); // تنظيف الاستعلام الدوري
    window.removeEventListener("storage", checkAuth);
    window.removeEventListener("authChange", checkAuth);
  };
}, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const isRegularUser = isAuthenticated && user.role === "user";

  // بناء رابط الصورة
  const getAvatarUrl = () => {
    if (!user.avatar || imageError) return null;
    if (user.avatar.startsWith('http')) return user.avatar;
    if (user.avatar.startsWith('/')) return `http://localhost:3000${user.avatar}?t=${Date.now()}`;
    return `/Uploads/${user.avatar}?t=${Date.now()}`;
  };

  return (
    <>
      {/* شريط التنقل لسطح المكتب */}
      <nav
        className="navbar navbar-expand-lg bg-white shadow-sm fixed-top d-none d-lg-flex"
        dir="rtl"
      >
        <div
          className="container-fluid d-flex align-items-center justify-content-between"
          style={{ direction: "rtl" }}
        >
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
          
          {isRegularUser && (
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
                    التحديات والشارات
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
                {getAvatarUrl() && !imageError ? (
                  <Image
                    src={getAvatarUrl()}
                    roundedCircle
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <FaUserCircle size={60} style={{ color: '#6c5dd3' }} />
                )}
                <span className="icon-notification" title="الإشعارات">
                  <Link className="nav-link" to="/notification">
                    🔔
                  </Link>
                </span>
                <span className="icon-settings" title="الإعدادات">
                  <Link
                    className="nav-link"
                    to={user.role === 'admin' ? '/admin-account' : '/account'}
                  >
                    ⚙️
                  </Link>
                </span>
                <button
                  onClick={handleLogout}
                  className="auth-link border-0 bg-transparent"
                  style={{ color: "#6c5dd3", cursor: "pointer" }}
                >
                  تسجيل خروج
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* شريط التنقل للجوال */}
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
            {isRegularUser && (
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
                    التحديات والشارات
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
                {getAvatarUrl() && !imageError ? (
                  <Image
                    src={getAvatarUrl()}
                    roundedCircle
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <FaUserCircle size={60} style={{ color: '#6c5dd3' }} />
                )}
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