import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './EmailConfirm1.css';

const EmailConfirm1 = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Send link to:', email);
    // TODO: Connect to backend
  };

  return (
    <Container fluid className="forgot-container d-flex justify-content-center align-items-center">
      <div className="Confirm1-box text-center rounded ">
        <img src="/images/img (6).svg" alt="mail bot" className="img-fluid " style={{ maxHeight: '200px' }} />
  
        <p >يلا خطوة أخيرة! ✉️</p>
        <p >بعتنالك إيميل على بريدك الإلكتروني علشان نفعّل 
          حسابك. اضغط على 💸 الرابط علشان تبدأ رحلتك 
          المالية معانا!</p>
    
      <Button type="submit" variant="primary" >
        <p>إعادة إرسال الرابط</p><p>يمكنك إعادة الإرسال خلال: 30 ثانية</p><img src='/images/🔁.png'/>
      </Button>
        

         
  
      
    </div>
    </Container>
  );
};

export default EmailConfirm1;
