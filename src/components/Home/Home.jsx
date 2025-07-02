import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "./Home.css";

const Home = () => {
  const chartData = [
    { month: "يناير", value: 7000 },
    { month: "فبراير", value: 8500 },
    { month: "مارس", value: 6000 },
    { month: "أبريل", value: 9000 },
    { month: "مايو", value: 7500 },
    { month: "يونيو", value: 8200 },
  ];

  return (
    <Container fluid className="home-page">
      {/* Header and greeting */}
      <div className="home-header">
        <div className="home-greeting-card">
          <div className="greeting-image-container">
            <img
              src="/Home/images/UserImage.png"
              alt="User"
              className="greeting-user-img"
            />
            <img
              src="/public/Home/icons/Data.svg"
              alt="bg-icon"
              className="greeting-bg-icon"
            />
          </div>
          <div className="greeting-text">
            <h2>👋 أهلاً يا سارة</h2>
            <p id="greeting-text-p">مستعد ترتب فلوسك؟</p>
          </div>
        </div>
      </div>
      <Row className="stats-cards gx-3 gy-3">
        <Col xs={12} md={3} className="d-flex">
          <div className="stat-card points">
            <div className="stat-row" style={{ flexDirection: "row-reverse" }}>
              <div className="stat-icon-bg points">
                <img
                  src="/Home/icons/Points.svg"
                  alt="النقاط"
                  className="stat-icon"
                />
              </div>
              <div className="stat-value" style={{ textAlign: "right" }}>
                1,250
              </div>
            </div>
            <div className="stat-label" style={{ textAlign: "right" }}>
              نقاطك
            </div>
            <div className="stat-progress">
              <div className="stat-progress-bar points"></div>
            </div>
          </div>
        </Col>
        <Col md={3} className="d-flex">
          <div className="stat-card goals">
            <div className="stat-row" style={{ flexDirection: "row-reverse" }}>
              <div className="stat-icon-bg goals">
                <img
                  src="/Home/icons/ActiveGoals.svg"
                  alt="الأهداف النشطة"
                  className="stat-icon"
                />
              </div>
              <div className="stat-value" style={{ textAlign: "right" }}>
                5
              </div>
            </div>
            <div className="stat-label" style={{ textAlign: "right" }}>
              الأهداف النشطة
            </div>
            <div className="stat-progress">
              <div className="stat-progress-bar goals"></div>
            </div>
          </div>
        </Col>
        <Col md={3} className="d-flex">
          <div className="stat-card expenses">
            <div className="stat-row" style={{ flexDirection: "row-reverse" }}>
              <div className="stat-icon-bg expenses">
                <img
                  src="/Home/icons/Currentexpenses.svg"
                  alt="المصروفات الحالية"
                  className="stat-icon"
                />
              </div>
              <div className="stat-value" style={{ textAlign: "right" }}>
                8,500
              </div>
            </div>
            <div className="stat-label" style={{ textAlign: "right" }}>
              المصروفات الحالية
            </div>
            <div className="stat-progress">
              <div className="stat-progress-bar expenses"></div>
            </div>
          </div>
        </Col>
        <Col md={3} className="d-flex">
          <div className="stat-card income">
            <div className="stat-row" style={{ flexDirection: "row-reverse" }}>
              <div className="stat-icon-bg income">
                <img
                  src="/Home/icons/allincome.svg"
                  alt="الدخل الكلي"
                  className="stat-icon"
                />
              </div>
              <div className="stat-value" style={{ textAlign: "right" }}>
                15,000
              </div>
            </div>
            <div className="stat-label" style={{ textAlign: "right" }}>
              الدخل الكلي
            </div>
            <div className="stat-progress">
              <div className="stat-progress-bar income"></div>
            </div>
          </div>
        </Col>
      </Row>
      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header" style={{ textAlign: "right" }}>
          تطور الإنفاق الشهري
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c5dd3" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6c5dd3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 16 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 14 }}
              axisLine={false}
              tickLine={false}
              width={60}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              formatter={(v) => v.toLocaleString()}
              labelFormatter={(l) => `الشهر: ${l}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6c5dd3"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              dot={{ r: 4, stroke: "#6c5dd3", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Daily Tip Section */}
      <div className="tip-section">
        <div className="tip-card">
          <div className="tip-content-right">
            <span className="tip-icon-bg">
              <img
                src="/Home/icons/Tipoftheday.svg"
                alt="نصيحة اليوم"
                style={{ width: "28px", height: "28px" }}
              />
            </span>
            <div className="tip-text-block">
              <span className="tip-title">نصيحة اليوم</span>
              <br />
              <span className="tip-text">
                وفر{" "}
                <span style={{ color: "#6c5dd3", fontWeight: 600 }}>10%</span>{" "}
                أول الشهر بدل آخره 😊
              </span>
            </div>
          </div>
          <button className="tip-btn">أعرف ليه</button>
        </div>
      </div>
      {/* Tasks/Progress Section */}
      <div className="tasks-section">
        <div className="tasks-progress-badge">مكتمل 75%</div>
        <div className="tasks-header">المهام اليومية</div>
        <ul className="tasks-list">
          <li className="task-row done">
            <span className="task-icon done">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#E0F7E9" />
                <path
                  d="M7 11.5L10 14.5L15 9.5"
                  stroke="#00C48C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="task-title">
              <span className="task-points done">+50 نقطة</span>
              أضف هدفًا جديدًا
            </span>
          </li>
          <li className="task-row done">
            <span className="task-icon done">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#E0F7E9" />
                <path
                  d="M7 11.5L10 14.5L15 9.5"
                  stroke="#00C48C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="task-title">
              <span className="task-points done">+50 نقطة</span>
              حدث ميزانيتك
            </span>
          </li>
          <li className="task-row pending">
            <span className="task-icon pending">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#F3F4F6" />
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="#D1D5DB"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="task-title">
              <span className="task-points pending">+50 نقطة</span>
              شات مع المساعد الذكي
            </span>
          </li>
        </ul>
      </div>
      {/* Call to Action / Info Card */}
      {/* <div className="cta-section"> */}
      <div className="cta-card">
        <img
          src="/Home/images/AiHome.png"
          alt="المساعد الذكي"
          className="ai-img"
        />
        <div>
          مش عارف تبدأ منين؟
          <br /> جرب المساعد الذكي الآن
        </div>
        <button className="cta-btn">ابدأ التحدث</button>
      </div>
      {/* </div> */}
    </Container>
  );
};

export default Home;
