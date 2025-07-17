import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Image, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaCrown, FaCamera, FaPiggyBank, FaMoon, FaGlobe, FaLock, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Account.css";

const Account = () => {
  const [user, setUser] = useState({ nickname: 'ساره محمود', email: 'sara.mahmoud@email.com', avatar: './jklj' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [totalBudget, setTotalBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const remaining = totalBudget - spent;
  const percentage = totalBudget === 0 ? 0 : (spent / totalBudget) * 100;
  const [monthYearString, setMonthYearString] = useState('');

  // استخرج userId بشكل صحيح
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser ? (parsedUser._id || parsedUser.id) : null;

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('لم يتم العثور على رمز التوثيق');
      }
      const response = await axios.post('/api/user/settings/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        localStorage.removeItem('token'); 
        navigate('/login'); 
      } else {
        alert('فشل تسجيل الخروج. حاول مرة أخرى.');
      }
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error.message);
      alert('حدث خطأ أثناء تسجيل الخروج.');
    }
  };

  const options = [
    { icon: <FaGlobe />, title: 'تغيير اللغة', subtitle: 'العربية / English' },
    { icon: <FaMoon />, title: 'تغيير الاسم', subtitle: 'تفعيل / إلغاء', onClick: () => navigate('/rename') },
    { icon: <FaLock />, title: 'تغيير كلمة السر', subtitle: 'حماية الحساب', onClick: () => navigate('/changePass') },
    { icon: <FaSignOutAlt />, title: 'تسجيل الخروج', subtitle: 'إنهاء الجلسة', onClick: handleLogout },
  ];

  // دالة جلب البيانات المالية
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

      const summaryRes = await axios.get('/api/summary', { 
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userId }
      });
      const balanceRes = await axios.get('/api/balance', { 
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userId }
      });

      setTotalIncome(summaryRes.data.total_income_received || 0);
      setSpent(summaryRes.data.total_expenses_made || 0);
      setCurrentBalance(balanceRes.data.current_balance || 0);
      setTotalBudget(summaryRes.data.total_budget || 0); // تأكد من اسم المتغير الصحيح في الـ API
      setLoading(false);
    } catch (error) {
      console.error("خطأ في جلب البيانات المالية:", error.message, error.response?.data);
      setError('فشل جلب البيانات المالية');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

        const response = await axios.get('/api/user/settings/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          nickname: response.data.data.user.nickname,
          email: response.data.data.user.email,
          avatar: response.data.data.user.avatar || 'default-avatar.png',
        });
        setLoading(false);
      } catch (err) {
        console.error("خطأ في جلب بيانات المستخدم:", err.message);
        setError('فشل جلب بيانات المستخدم');
        setLoading(false);
      }
    };

    fetchUserData();
    fetchFinancialData();

    const monthNames = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const today = new Date();
    setMonthYearString(`${monthNames[today.getMonth()]} ${today.getFullYear()}`);
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.patch(
        '/api/user/settings/update-avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        avatar: response.data.data.avatarUrl,
      }));
      setLoading(false);
      alert('تم تحديث الصورة بنجاح');
    } catch (err) {
      console.error("خطأ في تحديث الصورة:", err.message);
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الصورة');
      setLoading(false);
    }
  };

  return (
    <Container fluid className="account-container d-flex justify-content-center align-items-center py-4" style={{ direction: 'rtl' }}>
      {loading && <div className="text-center">جاري التحميل...</div>}
      {error && <div className="text-danger text-center mb-3">{error}</div>}
      <Card className="profile" style={{ maxWidth: '926px', width: '95%' }}>
        <Row className="align-items-center">
          <Col xs="auto">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
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
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                  <FaCamera size={12} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </Col>
          <Col>
            <div className="fw-semibold">{user.nickname}</div>
            <div className="text-muted small">{user.email}</div>
            <Badge bg="warning" text="white" className="mt-1 d-inline-flex align-items-center">
              <FaCrown className="ms-1" />
              Gold Member
            </Badge>
          </Col>
        </Row>
      </Card>

      <Card className="budget" style={{ maxWidth: '896px', width: '95%', marginTop: '20px' }}>
        <Row>
          <h5 className="px-4 monthy" style={{ width: '100%' }}>
            <img src="Account/Frame (13).svg" alt="budget icon" /> الميزانية الشهرية
          </h5>
          <Col xs={12} md={6} className="p-4" style={{ marginBottom: '20px' }}>
            <Form.Group className="mb-3">
              <Form.Label className="small now">الدخل الكلي</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={`${totalIncome} جنيه`}
                style={{ backgroundColor: 'transparent', border: '1px solid #E5E7EB', paddingLeft: 0 }}
                className="text-muted"
              />
            
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small">الشهر</Form.Label>
              <Form.Control
                plaintext
                readOnly
                value={monthYearString}
                style={{ backgroundColor: 'transparent', border: '1px solid #E5E7EB', paddingLeft: 0 }}
              />
            </Form.Group>
            <Button className="w-100 mt-2 rounded-3 update" onClick={fetchFinancialData}>
              <img src="Account/svg.svg" alt="update icon" /> تحديث الميزانية
            </Button>
            <p className="text-muted mt-3 key">
              "ميزانيتك هي مفتاح كل حاجة... ابدأ بيها صح 💪"
            </p>
          </Col>
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
                <span className="text-muted">المبلغ المصروف</span>
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
                <span className="text-muted"> المتبقى</span>
                <span className="almutabaqaa mablagh">{currentBalance} جنيه</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <div
        className="text-center m-4 fw-bold fs-5 setting"
        style={{ maxWidth: '896px', width: '95%', marginTop: '40px' }}
      >
        <FaCog className="ms-2" style={{ color: '#6C5DD3' }} /> الإعدادات
      </div>

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
                height: '76px',
                color: opt.title === 'تسجيل الخروج' ? '#FF6B6B' : undefined
              }}
              onClick={opt.onClick}
            >
              <div
                className="m-1"
                style={{
                  fontSize: "1.2rem",
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
