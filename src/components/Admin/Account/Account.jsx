import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Image, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaCrown, FaCamera,FaEdit, FaPiggyBank, FaMoon, FaTrash, FaLock, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AdminAccount = () => {
  const [user, setUser] = useState({ nickname: 'صاحبى', email: 'sara.mahmoud@email.com', avatar: './jklj' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [totalBudget, setTotalBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const remaining = currentBalance; // الرصيد يعتمد على currentBalance (13924 جنيه)
  const percentage = totalIncome === 0 ? 0 : Math.min(100, Math.round((spent / totalIncome) * 100)); // نسبة بناءً على الدخل
  const [monthYearString, setMonthYearString] = useState('');

  

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
        headers: { Authorization: `${token}` }
      });
      if (response.status === 200) {
        localStorage.removeItem('token'); 
        navigate('/login'); 
      } else {
      }
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error.message);
    }
  };


    const handleDeleteAccount = async () => {
  if (!window.confirm("هل أنت متأكد من حذف حسابك؟ سيتم حذف جميع البيانات ولا يمكن التراجع!")) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

    const response = await axios.delete('/api/user/settings/delete-account', {
      headers: { Authorization: `${token}` },
    });

    if (response.status === 204) {
      localStorage.clear();
      navigate('/');
    }
  } catch (error) {
    console.error("خطأ في حذف الحساب:", error.message);
  }
};


  const options = [
  { icon: <FaTrash />, title: 'حذف الحساب', subtitle: 'حذف الحساب ', onClick: handleDeleteAccount }, 
     { icon: <FaEdit />, title: 'تغيير الاسم', subtitle: 'تعديل الاسم', onClick: () => navigate('/rename') },
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
        headers: { Authorization: `${token}` }
      });
      console.log("Summary Data:", summaryRes.data); 
      
      const balanceRes = await axios.get('/api/balance', { 
        headers: { Authorization: `${token}` },
        params: { user_id: userId }
      });
      console.log("Balance Data:", balanceRes.data); // تسجيل البيانات للتحقق

      
      setTotalIncome(summaryRes.data.total_income_received || 0);
      setSpent(summaryRes.data.total_expenses_made || 0);
      setCurrentBalance(balanceRes.data.current_balance || 0);
      setTotalBudget(summaryRes.data.total_budget || 0);
      setLoading(false);
    } catch (error) {
      console.error("خطأ في جلب البيانات المالية:", error.message, error.response?.data);
      setError('فشل جلب البيانات المالية');
      setLoading(false);
    }
  };




  useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", {
            state: { 
              from: "/admin-account",
              message: "يجب تسجيل الدخول أولاً للوصول لصفحة الدفع" 
            }
          });
        }
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('لم يتم العثور على رمز التوثيق');

        const response = await axios.get('/api/user/settings/me', {
          headers: { Authorization: `${token}` },
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
  }, [navigate]);

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
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        avatar: response.data.data.avatarUrl,
      }));
      setLoading(false);
    } catch (err) {
      console.error("خطأ في تحديث الصورة:", err.message);
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الصورة');
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    navigate("/game");
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
               key={user.avatar} 
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
              Admin
            </Badge>
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

    </Container>
  );
};

export default AdminAccount;