import React from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import "./subscription.css";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();

  // Navigate to payment page with plan details
  const handleSubscribe = (planType, amount) => {
    navigate("/payment", {
      state: { planType, amount },
    });
  };

  return (
    <Container fluid className="forgot-container d-flex justify-content-center align-items-center">
      <div className="Rectangle">
        <p className="choose">اختر الباقة المناسبة لك</p>
        <p className="start">ابدأ رحلتك نحو الاستقلال المالي مع باقاتنا المصممة خصيصاً لاحتياجاتك</p>
        <img src="images/img (8).svg" className="gift" />
        <div className="discount">
          <p className="get">🎁 احصل على خصم لما تحقق أهدافك</p>
        </div>
      </div>

      <section className="plans-row">
        {/* Free Plan */}
        <Col md={4} className="plan-col">
          <Card className="plan-card free-plan">
            <Card.Body>
              <div className="free mt-3">
                <img src="images/Frame (9).svg" />
              </div>
              <Card.Title className="plan-title">مجانية</Card.Title>
              <div className="price-section">
                <span className="price">0</span>
                <span className="period">جنيه/شهر</span>
              </div>
              <ul className="features-list">
                <li>3 أهداف مالية</li>
                <li>تشارط طويلة بسيطة</li>
                <li>تقارير شهرية بسيطة</li>
                <li className="not">مساعد ذكي محدود</li>
              </ul>
              <Button variant="outline-primary" className="subscribe-btn" onClick={() => handleSubscribe("Free", 0)}>
                ابدأ مجاناً
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Premium Plan */}
        <Col md={4} className="plan-col">
          <Card className="plan-card premium-plan">
            <div className="popular-badge">الأكثر شيوعاً</div>
            <Card.Body>
              <div className="free mt-3">
                <img src="images/Frame (10).svg" />
              </div>
              <Card.Title className="plan-title">مميز</Card.Title>
              <div className="price-section">
                <span className="price">29</span>
                <span className="period">جنيه/شهر</span>
              </div>
              <ul className="features-list">
                <li>تتبع مصروفات متقدم</li>
                <li>أهداف ذكية غير محدودة</li>
                <li>تقارير تفصيلية أسبوعية</li>
                <li>مساعد ذكي متطور</li>
                <li>خصومات حصرية</li>
              </ul>
              <Button variant="light" className="subscribe-btn" onClick={() => handleSubscribe("Premium", 29)}>
                اشترك الآن
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Pro Plan */}
        <Col md={4} className="plan-col">
          <Card className="plan-card pro-plan">
            <Card.Body>
              <div className="free mt-3">
                <img src="images/Frame (11).svg" />
              </div>
              <Card.Title className="plan-title">احترافي</Card.Title>
              <div className="price-section">
                <span className="price">59</span>
                <span className="period">جنيه/شهر</span>
              </div>
              <ul className="features-list">
                <li>جميع مميزات الباقة المميزة</li>
                <li>تحليلات مالية متقدمة</li>
                <li>استشارات مالية شخصية</li>
                <li>تنبيهات ذكية متقدمة</li>
                <li>دعم فني أولوية</li>
              </ul>
              <Button variant="primary" className="subscribe-btn" onClick={() => handleSubscribe("Pro", 59)}>
                اشترك الآن
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </section>

      <section className="option">
        <div className="privat pt-4">
          <div>
            <img src="images/img (9).svg" />
          </div>
          <p className="offer">🎉 عرض خاص محدود</p>
          <p className="Free">احصل على شهر إضافي مجاناً عند الاشتراك في أي باقة مدفوعة خلال هذا الأسبوع</p>
          <div className="expire-badge">
            <span>ينتهي خلال 3 أيام</span>
          </div>
          <img src="images/Vector.svg" alt="fire" className="fire-icon" />
        </div>
      </section>
    </Container>
  );
};

export default Subscription;
