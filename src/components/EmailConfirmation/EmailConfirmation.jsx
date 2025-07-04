import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './EmailConfirmation.css';

const EmailConfirmation = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Send link to:', email);
    // TODO: Connect to backend
  };

  return (
    <Container fluid className="forgot-container d-flex justify-content-center align-items-center">
      <div className="Confirm-box text-center rounded ">
        <img src="/images/img (5).svg" alt="mail bot" className="img-fluid " style={{ maxHeight: '200px' }} />
  
        <p>تم تفعيل حسابك بنجاح! 🎉</p>
        <p >🚀 دلوقتي كل مميزات ماي كاش مفتوحة ليك… يلا نبدأ نخطط وننطلق!</p>
       <Button
          style={{
            backgroundColor: '#7C2DFF',
            border: 'none',
            borderRadius: 12,
            padding: '12px 40px',
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            cursor: 'pointer',
background: 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 25%, #C084FC 50%, #A855F7 75%, #8B5CF6 100%)',
          }}
       
        >
          ابدأ الآن
        </Button>
        

         
  
      
    </div>
    </Container>
  );
};

export default EmailConfirmation;
