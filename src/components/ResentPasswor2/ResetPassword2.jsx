import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import AppearPassIcon from "/Register2/icons/AppearPass.svg";
import axios from 'axios';
import './ResetPassword2.css';

const ResetPassword2 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('كلمتا السر غير متطابقتين');
      return;
    }

    try {
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
    } catch (err) {
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
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <img
                  src={AppearPassIcon}
                  alt="show/hide password"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    width: 24,
                    height: 24,
                  }}
                  onClick={() => setShowPassword(prev => !prev)}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>🔑 تأكيد كلمة السر</Form.Label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <img
                  src={AppearPassIcon}
                  alt="show/hide password"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    width: 24,
                    height: 24,
                  }}
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                />
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
