import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('كلمتا السر الجديدة وتأكيدها غير متطابقتين');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/user/settings/change-password', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage('تم تحديث كلمة المرور بنجاح! سيتم توجيهك إلى صفحة الحساب.');
        setTimeout(() => {
          navigate('/account');
        }, 2000);
      } else {
        setError(data.message || 'حدث خطأ أثناء تحديث كلمة المرور');
      }
    } catch (err) {
      console.log('Error Response:', err);
      setError('فشل الاتصال بالسيرفر. حاول لاحقًا.');
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
              <Form.Label>🔑 كلمة المرور الحالية</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  type="password"
                  placeholder="ادخل كلمة المرور الحالية"
                  value={currentPassword}
                  className="custom-placeholder"
                  dir="rtl"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <img src="/images/Frame (5).svg" alt="eye icon" className="input-icon" />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>🔑 كلمة السر الجديدة</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  type="password"
                  placeholder="أدخل كلمة السر الجديدة"
                  value={newPassword}
                  className="custom-placeholder"
                  dir="rtl"
                  onChange={(e) => setNewPassword(e.target.value)}
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

export default ChangePassword;
