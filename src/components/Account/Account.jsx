import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Image, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaCrown, FaCamera, FaPiggyBank, FaMoon, FaGlobe, FaLock, FaSignOutAlt, FaCog, FaTimes } from 'react-icons/fa';

import "./Account.css";

const Account = () => {
  const totalBudget = 5000;
  const spent = 3200;
  const remaining = totalBudget - spent;
  const percentage = (spent / totalBudget) * 100;

  // States لإدارة البيانات
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("ساره محمود");
  const [language, setLanguage] = useState("العربية");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const fileInputRef = useRef(null);

  // استرجاع الصورة المحفوظة عند التحميل
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const options = [
    { 
      icon: <FaGlobe />, 
      title: 'تغيير اللغة', 
      subtitle: 'العربية / English',
      action: () => {
        setShowLanguageForm(true);
        setError("");
        setSuccess("");
      }
    },
    { 
      icon: <FaMoon />, 
      title: 'تغيير الاسم', 
      subtitle: 'تفعيل / إلغاء',
      action: () => {
        setShowNameForm(true);
        setError("");
        setSuccess("");
      }
    },
    { 
      icon: <FaLock />, 
      title: 'تغيير كلمة السر', 
      subtitle: 'حماية الحساب',
      action: () => {
        setShowPasswordForm(true);
        setError("");
        setSuccess("");
      }
    },
    { 
      icon: <FaSignOutAlt />, 
      title: 'تسجيل الخروج', 
      subtitle: 'إنهاء الجلسة',
      action: handleLogout
    },
  ];

  // دالة رفع الصورة (تخزين محلي فقط)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من أن الملف صورة
    if (!file.type.match('image.*')) {
      setError("الملف يجب أن يكون صورة");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
      localStorage.setItem('userAvatar', e.target.result); // حفظ في localStorage
      setIsLoading(false);
      setSuccess("تم تحديث الصورة بنجاح");
      setTimeout(() => setSuccess(""), 3000);
    };
    reader.onerror = () => {
      setError("حدث خطأ أثناء تحميل الصورة");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // دالة تسجيل الخروج
  async function handleLogout() {
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3000/api/user/settings/logout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      localStorage.removeItem("token");
      localStorage.removeItem('userAvatar'); // حذف الصورة المحفوظة
      window.location.href = "/login";
      
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem('userAvatar');
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  }

  // دالة تغيير كلمة المرور
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة غير متطابقة");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/user/settings/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess("تم تغيير كلمة المرور بنجاح");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setError(data.message || "حدث خطأ أثناء تغيير كلمة المرور");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  // دالة تغيير اللغة
  const handleChangeLanguage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/user/settings/update-me", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ language }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess("تم تغيير اللغة بنجاح");
        setTimeout(() => setShowLanguageForm(false), 2000);
      } else {
        setError(data.message || "حدث خطأ أثناء تغيير اللغة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  // دالة تغيير الاسم
  const handleChangeName = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!nickname.trim()) {
      setError("الاسم لا يمكن أن يكون فارغًا");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/user/settings/update-me", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess("تم تغيير الاسم بنجاح");
        setTimeout(() => setShowNameForm(false), 2000);
      } else {
        setError(data.message || "حدث خطأ أثناء تغيير الاسم");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="account-container d-flex justify-content-center align-items-center py-4" style={{ direction: 'rtl' }}>
      {/* نماذج الإعدادات */}
      {showPasswordForm && (
        <div className="password-form-container">
          <div className="password-form">
            <div className="form-header">
              <h5>تغيير كلمة المرور</h5>
              <button 
                onClick={() => setShowPasswordForm(false)}
                className="close-btn"
                disabled={isLoading}
              >
                <FaTimes />
              </button>
            </div>
            <div className="form-body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>كلمة المرور الحالية</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>كلمة المرور الجديدة</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>تأكيد كلمة المرور الجديدة</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={isLoading}>
                  {isLoading ? 'جاري التحميل...' : 'تغيير كلمة المرور'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}

      {showLanguageForm && (
        <div className="password-form-container">
          <div className="password-form">
            <div className="form-header">
              <h5>تغيير اللغة</h5>
              <button onClick={() => setShowLanguageForm(false)} className="close-btn" disabled={isLoading}>
                <FaTimes />
              </button>
            </div>
            <div className="form-body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleChangeLanguage}>
                <Form.Group className="mb-3">
                  <Form.Label>اختر اللغة</Form.Label>
                  <Form.Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="العربية">العربية</option>
                    <option value="English">English</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={isLoading}>
                  {isLoading ? 'جاري التحميل...' : 'حفظ التغييرات'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}

      {showNameForm && (
        <div className="password-form-container">
          <div className="password-form">
            <div className="form-header">
              <h5>تغيير الاسم</h5>
              <button onClick={() => setShowNameForm(false)} className="close-btn" disabled={isLoading}>
                <FaTimes />
              </button>
            </div>
            <div className="form-body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleChangeName}>
                <Form.Group className="mb-3">
                  <Form.Label>الاسم الجديد</Form.Label>
                  <Form.Control
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={isLoading}>
                  {isLoading ? 'جاري التحميل...' : 'حفظ التغييرات'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <Card className="profile" style={{ maxWidth: '926px', width: '95%' }}>
        <Row className="align-items-center">
          <Col xs="auto">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Image
                src={avatar}
                roundedCircle
                width={60}
                height={60}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  backgroundColor: '#6C5DD3'
                }}
                onClick={() => !isLoading && fileInputRef.current.click()}
              >
                <FaCamera size={12} color="white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={isLoading}
              />
            </div>
          </Col>

          <Col>
            <div className="fw-semibold">{nickname}</div>
            <div className="text-muted small">sara.mahmoud@email.com</div>
            <Badge bg="warning" text="white" className="mt-1 d-inline-flex align-items-center">
              <FaCrown className="ms-1" />
              Gold Member
            </Badge>
          </Col>
        </Row>
      </Card>

      {/* Budget Card */}
      <Card className="budget" style={{ maxWidth: '896px', width: '95%', marginTop: '20px' }}>
        <Row>
          <h5 className="px-4 monthy" style={{ width: '100%' }}>
            <img src="Account/Frame (13).svg" alt="budget icon" /> الميزانية الشهرية
          </h5>

          {/* الجهة اليمنى */}
          <Col xs={12} md={6} className="p-4" style={{ marginBottom: '20px' }}>
            <Form.Group className="mb-3">
              <Form.Label className="small now">الميزانية الحالية</Form.Label>
              <Form.Control
                type="text"
                readOnly
                defaultValue={`${totalBudget} جنيه`}
                style={{ backgroundColor: 'transparent', border: '1px solid #E5E7EB', paddingLeft: 0 }}
                className="text-muted"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small">الشهر</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue="   يناير 2024 "
                style={{ backgroundColor: 'transparent', border: '1px solid #E5E7EB', paddingLeft: 0 }}
              />
            </Form.Group>

            <Button className="w-100 mt-2 rounded-3 update">
              <img src="Account/svg.svg" alt="update icon" /> تحديث الميزانية
            </Button>

            <p className="text-muted mt-3 key" >
              "ميزانيتك هي مفتاح كل حاجة... ابدأ بيها صح 💪"
            </p>
          </Col>

          {/* الجهة اليسرى */}
          <Col
            xs={12}
            md={6}
            className="rounded-4 flex-column align-items-center justify-content-center text-center p-4 hala"
            style={{ marginBottom: '20px' }}
          >
            <FaPiggyBank size={40} className="mb-2" style={{ color: '#6C5DD3' }} />
            <h6 className="mb-3">حالة الميزانية</h6>
            <div className="w-100">
              <div className="d-flex justify-content-between px-2 small">
                <span className="text-muted" style={{ color: '#7B88A8' }}>المبلغ المصروف</span>
                <span className="almasruf mablagh">{spent} جنيه</span>
              </div>

              <ProgressBar
                now={percentage}
                className="my-2"
                style={{ height: "8px", borderRadius: "5px", backgroundColor: '#e0e0e0' }}
              >
                <ProgressBar
                  now={percentage}
                  style={{
                    background: 'linear-gradient(90deg, #6C5DD3 0%, #00C48C 100%)',
                    borderRadius: '5px'
                  }}
                />
              </ProgressBar>
              <div className="d-flex justify-content-between px-2 small">
                <span className="text-muted" style={{ color: '#7B88A8' }}>المتبقي</span>
                <span className="almutabaqaa mablagh">{remaining} جنيه</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Settings Title */}
      <div
        className="text-center m-4 fw-bold fs-5 setting"
        style={{ maxWidth: '896px', width: '95%', marginTop: '40px' }}
      >
        <FaCog className="ms-2" style={{ color: '#6C5DD3' }} /> الإعدادات
      </div>

      {/* Options Buttons */}
      <div
        className="d-flex flex-wrap justify-content-center"
        style={{ gap: '20px', maxWidth: '896px', width: '95%', margin: '0 auto' }}
      >
        {options.map((opt, idx) => (
          <div key={idx} style={{ flex: '1 1 416px', maxWidth: '416px' }}>
            <Button
              variant="light"
              className="text-start d-flex align-items-center px-3 py-3 shadow-sm"
              style={{
                backgroundColor: '#F5F7FA',
                border: 'none',
                borderRadius: '12px',
                width: '100%',
                height: '76px'
              }}
              onClick={opt.action || (() => {})}
              disabled={isLoading && opt.title === 'تسجيل الخروج'}
            >
              <div
                className="m-1"
                style={{
                  fontSize: '1.2rem',
                  color: opt.title === 'تسجيل الخروج' ? '#FF6B6B' : '#6C5DD3'
                }}
              >
                {opt.icon}
              </div>
              <div>
                <div className="fw-semibold title">{opt.title}</div>
                <div className="text-muted small subtitle">{opt.subtitle}</div>
              </div>
            </Button>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <section className="achivements" style={{ maxWidth: '896px', width: '95%', marginTop: '50px' }}>
        <div className="achivement pt-4" style={{ maxWidth: '848px', margin: '0 auto' }}>
          <div>
            <img src="Account/Vector.svg" alt="achivement icon" />
          </div>
          <p className="month text-white">إنجازاتك هذا الشهر</p>
          <div className="points pt-2" style={{
            maxWidth: '848px',
            margin: '0 auto',
            height: 'auto'
          }}>
            <div style={{
              width: '100%',
              fontFamily: 'Cairo',
              fontWeight: '400',
              fontSize: '30px',
              textAlign: 'center',
              color: '#FFFFFF'
            }}>1,250</div>

            <div className="mt-2" style={{
              width: '100%',
              fontFamily: 'Cairo',
              fontWeight: '400',
              fontSize: '14px',
              textAlign: 'center',
              color: '#FFFFFF'
            }}>نقطة توفير</div>
          </div>

          <div className="challengs" style={{ maxWidth: '414px', margin: '30px auto 0 auto' }}>
            <span>تحديات وشارات</span>
          </div>

        </div>
      </section>
    </Container>
  );
};

export default Account;
