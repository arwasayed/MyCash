import React from "react";
import { Container, Row, Col, Card, Badge, Image, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaCrown, FaCamera, FaPiggyBank, FaMoon, FaGlobe, FaLock, FaSignOutAlt, FaCog } from 'react-icons/fa';

import "./Account.css";

const Account = () => {
  const totalBudget = 5000;
  const spent = 3200;
  const remaining = totalBudget - spent;
  const percentage = (spent / totalBudget) * 100;

  const options = [
    { icon: <FaGlobe />, title: 'تغيير اللغة', subtitle: 'العربية / English' },
    { icon: <FaMoon />, title: ' تغيير الاسم', subtitle: 'تفعيل / إلغاء' },
    { icon: <FaLock />, title: 'تغيير كلمة السر', subtitle: 'حماية الحساب' },
    { icon: <FaSignOutAlt />, title: 'تسجيل الخروج', subtitle: 'إنهاء الجلسة' },
  ];

  return (
    <Container fluid className="account-container d-flex justify-content-center align-items-center py-4" style={{ direction: 'rtl' }}>
      {/* Profile Card */}
      <Card className="profile" style={{ maxWidth: '926px', width: '95%' }}>
        <Row className="align-items-center">
          <Col xs="auto">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Image
                src="./jklj"
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
                <FaCamera size={12} />
              </div>
            </div>
          </Col>

          <Col>
            <div className="fw-semibold">ساره محمود</div>
            <div className="text-muted small">sara.mahmoud@email.com</div>
            <Badge bg="warning" text="white" className="mt-1 d-inline-flex align-items-center">
              <FaCrown className="ms-1" />
              Gold Member
            </Badge>
          </Col>
        </Row>
      </Card>

      {/* Budget Card */}
      <Card className="budget" style={{ maxWidth: '896px', width: '95%', marginTop: '20px' }}>
        <Row>
          <h5 className="px-4 monthy" style={{ width: '100%' }}>
            <img src="Account/Frame (13).svg" alt="budget icon" /> الميزانية الشهرية
          </h5>

          {/* الجهة اليمنى */}
          <Col xs={12} md={6} className="p-4" style={{ marginBottom: '20px' }}>
            <Form.Group className="mb-3">
              <Form.Label className="small now">الميزانية الحالية</Form.Label>
              <Form.Control
                type="text"
                readOnly
                defaultValue={`${totalBudget} جنيه`}
                style={{ backgroundColor: 'transparent', border: '1px solid #E5E7EB', paddingLeft: 0 }}
                className="text-muted"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small">الشهر</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue="   يناير 2024 "
                style={{ backgroundColor: 'transparent', border: '1px solid #E5E7EB', paddingLeft: 0 }}
              />
            </Form.Group>

            <Button className="w-100 mt-2 rounded-3 update">
              <img src="Account/svg.svg" alt="update icon" /> تحديث الميزانية
            </Button>

            <p className="text-muted mt-3 key" >
              "ميزانيتك هي مفتاح كل حاجة... ابدأ بيها صح 💪"
            </p>
          </Col>

          {/* الجهة اليسرى */}
          <Col
            xs={12}
            md={6}
            className="rounded-4 flex-column align-items-center justify-content-center text-center p-4 hala"
            style={{ marginBottom: '20px' }}
          >
            <FaPiggyBank size={40} className="mb-2" style={{ color: '#6C5DD3' }} />
            <h6 className="mb-3">حالة الميزانية</h6>
            <div className="w-100">
              <div className="d-flex justify-content-between px-2 small">
                <span className="text-muted" style={{ color: '#7B88A8' }}>المبلغ المصروف</span>
                <span className="almasruf mablagh">{spent} جنيه</span>
              </div>

              <ProgressBar
                now={percentage}
                className="my-2"
                style={{ height: "8px", borderRadius: "5px", backgroundColor: '#e0e0e0' }}
              >
                <ProgressBar
                  now={percentage}
                  style={{
                    background: 'linear-gradient(90deg, #6C5DD3 0%, #00C48C 100%)',
                    borderRadius: '5px'
                  }}
                />
              </ProgressBar>
              <div className="d-flex justify-content-between px-2 small">
                <span className="text-muted" style={{ color: '#7B88A8' }}>المتبقي</span>
                <span className="almutabaqaa mablagh">{remaining} جنيه</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Settings Title */}
      <div
        className="text-center m-4 fw-bold fs-5 setting"
        style={{ maxWidth: '896px', width: '95%', marginTop: '40px' }}
      >
        <FaCog className="ms-2" style={{ color: '#6C5DD3' }} /> الإعدادات
      </div>

      {/* Options Buttons */}
      <div
        className="d-flex flex-wrap justify-content-center"
        style={{ gap: '20px', maxWidth: '896px', width: '95%', margin: '0 auto' }}
      >
        {options.slice(0, 4).map((opt, idx) => (
          <div key={idx} style={{ flex: '1 1 416px', maxWidth: '416px' }}>
            <Button
              variant="light"
              className="text-start d-flex align-items-center px-3 py-3 shadow-sm"
              style={{
                backgroundColor: '#F5F7FA',
                border: 'none',
                borderRadius: '12px',
                width: '100%',
                height: '76px'
              }}
              onClick={() => { }}
            >
              <div
                className="m-1"
                style={{
                  fontSize: '1.2rem',
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

      {/* Achievements Section */}
      <section className="achivements" style={{ maxWidth: '896px', width: '95%', marginTop: '50px' }}>
        <div className="achivement pt-4" style={{ maxWidth: '848px', margin: '0 auto' }}>
          <div>
            <img src="Account/Vector.svg" alt="achivement icon" />
          </div>
          <p className="month text-white">إنجازاتك هذا الشهر</p>
          <div className="points pt-2" style={{
            maxWidth: '848px',
            margin: '0 auto',
            height: 'auto'
          }}>
            <div style={{
              width: '100%',
              fontFamily: 'Cairo',
              fontWeight: '400',
              fontSize: '30px',
              textAlign: 'center',
              color: '#FFFFFF'
            }}>1,250</div>

            <div className="mt-2" style={{
              width: '100%',
              fontFamily: 'Cairo',
              fontWeight: '400',
              fontSize: '14px',
              textAlign: 'center',
              color: '#FFFFFF'
            }}>نقطة توفير</div>
          </div>

          <div className="challengs" style={{ maxWidth: '414px', margin: '30px auto 0 auto' }}>
            <span>تحديات وشارات</span>
          </div>

        </div>
      </section>
    </Container>
  );
};

export default Account;
