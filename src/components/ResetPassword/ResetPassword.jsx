import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const { state } = useLocation();
  const email = state?.email || 'example@email.com';
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResend = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:3000/api/user/forgot-password`, { email });
      if (response.data.status === 'success') {
        setMessage('تم إعادة إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إعادة إرسال الرابط. حاول مرة أخرى.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container fluid className="forgot-container d-flex justify-content-center align-items-center">
      <div className="reset-box text-center rounded shadow">
        <img src="/images/div.svg" alt="mail bot" className="img-fluid correct mb-4" style={{ maxHeight: '200px' }} />
        <img src="/images/img (3).svg" alt="mail bot" className="img-fluid mb-4" style={{ maxHeight: '200px' }} />
        <h1 className="connect">الرابط في الطريق!</h1>
        <p className="changePass p-3">
          بعتنالك إيميل على <span>{email}</span> فيه رابط لتغيير<br/> كلمة السر. لو مش شايفه، بص في الرسائل الغير مرغوب فيها{' '}
          <img src="/images/Frame (4).svg" alt="spam icon" />
        </p>
        
        {/* رسائل التنبيه المخصصة */}
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

        
        <div className="send">
          <Button variant="light" className="back" onClick={handleBackToLogin}>
            رجوع تسجيل الدخول
          </Button>
          <br></br>
          <Button className="btn-resend" onClick={handleResend}>
            إعادة الإرسال
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword;