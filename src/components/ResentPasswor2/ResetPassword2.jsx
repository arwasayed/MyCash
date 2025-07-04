import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword2.css';

const ResetPassword2 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('كلمتا السر غير متطابقتين');
      return;
    }

    try {
      // استخدم رابط نسبي يبدأ بـ /api فقط
      const response = await axios.patch(`/api/user/reset-password/${token}`, {
        password,
        passwordConfirm: confirmPassword,
      });

      if (response.data.status === 'success') {
        setMessage('تم تحديث كلمة المرور بنجاح! سيتم توجيهك إلى تسجيل الدخول.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }catch (err) {
  console.log('Error Response:', err.response);
  setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى.');
}

  };

  return (
    <Container fluid className="forgot-container d-flex justify-content-center align-items-center">
      <div className="reset-box1 text-center rounded">
        <img src="/images/img (4).svg" alt="mail bot" className="img-fluid mb-4" style={{ maxHeight: '200px' }} />
        <div className="shadow newPass">
          <div className="newPass1">
            <p className="connect">عيّن كلمة سر جديدة 🔒</p>
            <p className="changePass1">اختار كلمة سر قوية، علشان حسابك يفضل بأمان.</p>
          </div>
          <Form onSubmit={handleSubmit} className="resetpass">
            <Form.Group className="mb-3">
              <Form.Label>🔑 كلمة السر الجديدة</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  type="password"
                  placeholder="أدخل كلمة السر الجديدة"
                  value={password}
                  className="custom-placeholder"
                  dir="rtl"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <img src="/images/Frame (5).svg" alt="eye icon" className="input-icon" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>🔑 تأكيد كلمة السر</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  type="password"
                  placeholder="أعد إدخال كلمة السر"
                  value={confirmPassword}
                  className="custom-placeholder"
                  dir="rtl"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <img src="/images/Frame (5).svg" alt="eye icon" className="input-icon" />
              </div>
            </Form.Group>
{message && (
  <div className="custom-alert success">
    <span className="alert-icon">✅</span>
    <span className="alert-text">{message}</span>
  </div>
)}

{error && (
  <div className="custom-alert error">
    <span className="alert-icon">❌</span>
    <span className="alert-text">{error}</span>
  </div>
)}


            <Button type="submit" variant="primary" className="w-100 submit-btn">
              حفظ وتسجيل الدخول
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword2;
