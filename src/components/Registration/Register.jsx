import React, { useState } from 'react';
import './Register.css';
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';

const SignupSection = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname: fullName }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
      }
      const data = await response.json();
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container fluid className="responsive-container">
      <div className="custom-div content-wrapper">
        <div className="register-form">
          <div className='form-header'>
            <h1 className="form-title">💸 !يلا نبدأ نوفر سوا</h1>
            <p className="form-subtitle">انضم لآلاف المستخدمين واحصل على تحكم كامل في أموالك</p>
          </div>
       
          <Form onSubmit={handleSignup}>
            <Form.Group className="position-relative input-with-icon">
              <Form.Label className=''>الاسم الكامل</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <img src="/images/Frame.svg" alt="user icon" className="input-icon" />
              <br/>
            </Form.Group>

            <Form.Group className="mb-3 position-relative input-with-icon">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src="/images/Frame (1).svg" alt="user icon" className="input-icon" />
            </Form.Group>

            <Form.Group className="mb-3 position-relative input-with-icon">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة مرور قوية"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src="/images/Frame (2).svg" alt="user icon" className="input-icon" />
            </Form.Group>

            <Form.Group className="mb-3 position-relative input-with-icon">
              <Form.Label>تأكيد كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img src="/images/Frame (2).svg" alt="user icon" className="input-icon" />
            </Form.Group>

            <Form.Group className="mb-3 form-check" dir='rtl'>
              <Form.Check
                type="checkbox"
                label={
                  <span>  
                    أوافق على
                    <a href="#" className="terms-link"> الشروط والأحكام وسياسة الخصوصية</a>
                  </span>
                }
              />
              <br/>
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button variant="primary" className="register-button" type="submit">
              <p>← إنشاء حساب جديد</p>
            </Button>
          </Form>

          <p className="login-text">تسجيل الدخول<Link to="/login" className='login-link'> لديك حساب بالفعل؟</Link></p>
        </div>
        
        <div className='welcome-content'>
          <div className='welcome-gradient'>
            <img src="/images/img.svg" alt="Welcome illustration" className="welcome-image" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignupSection;
