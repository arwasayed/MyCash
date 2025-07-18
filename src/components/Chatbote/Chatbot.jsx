import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { Container, Row, Col, Image, Button, Card, ProgressBar, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [file, setFile] = useState(null);
const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const [user, setUser] = useState({});

  useEffect(() => {


      const fetchUser = async () => {
          try {
            const res = await axios.get('http://localhost:3000/api/user/settings/me', {
              headers: {
                Authorization: ` ${localStorage.getItem('token')}`
              }
            });
            setUser(res.data.data.user);
          } catch (err) {
            console.error('خطأ في جلب البيانات:', err);
          }
        };
        fetchUser();
    
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('يرجى تسجيل الدخول أولاً');
          return;
        }

        const url = new URL('http://localhost:3000/api/chat/history');
        url.searchParams.append('user_id', userId);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: ` ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`خطأ في جلب المحادثات: ${response.statusText}`);
        }

        const data = await response.json();

        setMessages(
          data.history.map((msg) => ({
            sender: msg.sender,
            message: msg.message,
            timestamp: msg.timestamp,
          }))
        );
      } catch (err) {
        setError('فشل في جلب المحادثات السابقة');
        console.error(err);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    setLoading(true);
    setError('');
    setSubscriptionMessage('');

    const newMessage = {
      sender: 'user',
      message: input || (file ? `ملف مرفق: ${file.name}` : ''),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setFile(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('يرجى تسجيل الدخول أولاً');
        setLoading(false);
        return;
      }

      let response, data;

      if (file) {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('message', input);
        formData.append('file', file);

        response = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ user_id: userId, message: input }),
        });
      }

      if (!response.ok) {
        throw new Error(`فشل في إرسال الرسالة: ${response.statusText}`);
      }

      data = await response.json();

      if (data.requires_subscription) {
        setSubscriptionMessage(data.message);
      } else {
        const botMessage = {
          sender: 'bot',
          message: data.reply,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      setError(err.message || 'فشل في إرسال الرسالة');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('تم اختيار ملف:', selectedFile);
    }
  };

  const financialSummary = { savings: 50, investments: 30, luxury: 20 };

  return (
    <Container fluid className="chat-container d-flex justify-content-center align-items-center">
      <Row className="chat-ai">
        <Col xs="auto">
          <Image src="/chatbot/div.svg" alt="Robot" className="helper-image" fluid />
        </Col>
      </Row>

      <Row>
        <Col xs="auto" className="text-center text-md-end mt-2">
          <h2 className="chat-title">المساعد الذكي</h2>
          <p className="chat-subtext">مساعدك الشخصي لإدارة الأموال والاستثمار الذكي</p>
        </Col>
      </Row>

      <Row className="align-items-center justify-content-center instructions">
        <Col><span style={{ margin: '0 5px' }} className="instruction">💰 كيف أوفر المال؟</span></Col>
        <Col><span style={{ margin: '0 5px' }} className="instruction">📊 تحليل مصروفاتي</span></Col>
        <Col><span style={{ margin: '0 5px' }} className="instruction">🎯 خطة استثمار</span></Col>
        <Col><span style={{ margin: '0 5px' }} className="instruction">💳 نصائح بنكية</span></Col>
      </Row>

      {/* صندوق الدردشة */}
      <div className="p-4 chat" dir="ltr">
        {error && <Alert variant="danger">{error}</Alert>}
        {subscriptionMessage && <Alert variant="warning">{subscriptionMessage}</Alert>}

        <div className="messages-container">
          {messages.map((msg, index) => (
            <Row
              key={index}
              className={`mb-3 justify-content-${msg.sender === 'user' ? 'start' : 'end'} align-items-center`}
            >
              {msg.sender === 'user' ? (
                <>
                  <Col xs="auto">
 <Image
  src={
    user?.avatar
      ? user.avatar.startsWith('http')
        ? user.avatar
        : user.avatar.startsWith('/')
        ? `http://localhost:3000${user.avatar}?t=${Date.now()}`
        : `/Uploads/${user.avatar}?t=${Date.now()}`
      : '/default-avatar.png'
  }
  roundedCircle
  width={60}
  height={60}
  style={{ objectFit: 'cover' }}
/>

                  </Col>
                  <Col xs="auto" className="message-col">
                    <Card className="px-3 py-2 rounded-pill border-0 user-chat">{msg.message}</Card>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={12} md={7} className="message-col">
                    <Card className="p-3 shadow-sm ai-chat" >
                      {msg.message.includes('إليك أهم النصائح') ? (
                        <>
                          
                        </>
                      ) : (
                        <p>{msg.message}</p>
                      )}
                    </Card>
                  </Col>
                  <Col xs="auto">
                    <Image src="/chatbot/div.png" alt="Bot" className="chat-image" />
                  </Col>
                </>
              )}
            </Row>
          ))}
        </div>

        <Row className="enter-text mt-3" dir="rtl">
          <Col xs={12} md={8} className="mx-auto">
            <Form onSubmit={handleSendMessage}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="link" className="p-0 border-0 send-btn" type="submit" disabled={loading}>
                  <Image
                    src="/chatbot/button.png"
                    alt="Send"
                    className="send-image"
                    style={{ height: '32px', width: '32px' }}
                  />
                </Button>

                <div style={{ position: 'relative', flex: 1 }}>
                  <Form.Control
                    dir="rtl"
                    placeholder="اكتب رسالتك هنا..."
                    className="enter-chat pe-5"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                  />

                  <label
                    htmlFor="file-upload"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '20px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      marginBottom: 0,
                    }}
                  >
                    <Image src="/chatbot/button (1).png" alt="Attach" />
                  </label>

                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                </div>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Chatbot;