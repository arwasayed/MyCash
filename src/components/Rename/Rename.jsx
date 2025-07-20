import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, InputGroup, Button, Form } from 'react-bootstrap';
import { Link ,useNavigate } from "react-router-dom";
import axios from 'axios';
import './Rename.css';

const Rename = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { 
          from: "/rename",
          message: "يجب تسجيل الدخول أولاً للوصول لصفحة الدفع" 
        }
      });
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/settings/me', {
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
  }, [navigate]);

  const handleSave = async () => {
    try {
      const res = await axios.patch('/api/user/settings/update-me', {
        nickname: newName
      }, {
        headers: {
          Authorization: ` ${localStorage.getItem('token')}`
        }
      });
      setUser(res.data.data.user); 
      setNewName('');
    } catch (err) {
      console.error('فشل الحفظ:', err);
    }
  };

  return (
    <Container fluid className="rename-container d-flex justify-content-center align-items-center py-4" style={{ direction: 'rtl' }}>
      <Card className="name">
        <Row className="align-items-center">
          <Col xs="auto">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
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


            </div>
          </Col>
          <Col>
            <div className="fw-semibold">{user.nickname}</div>
            <div className="text-muted small">{user.email}</div>
          </Col>
        </Row>
      </Card>

      <div className="update">
        <div style={{ width: '1200px', height: '28px', marginTop: '18px' }}>
          <p className="name-update">✏️ تعديل الاسم</p>
        </div>

        <label className="current-name">الاسم الحالي: {user.nickname}</label>

        <Form>
          <InputGroup className="mb-3">
            <Form.Control
              className="new-name"
              type="text"
              placeholder=" أدخل الاسم الجديد"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </InputGroup>

          <p className="show-name mx-5">الاسم سيظهر في ملفك الشخصي </p>

          <div className="d-flex gap-2 mt-3 mb-3 buttons-row">
            <Button className="save-name" onClick={handleSave}>💾 حفظ التعديل</Button>
            <Link className="cancel "  to={user.role === 'admin' ? '/admin-account' : '/account'}>إلغاء</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Rename;
