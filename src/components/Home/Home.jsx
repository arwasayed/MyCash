import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "./Home.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const arabicMonthOrder = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  const tips = [
    "وفر 10% أول الشهر بدل آخره 😊",
    "حاول تشتري بالجملة وتوفر مصاريف يومية 🛒",
    "قسم دخلك على احتياجات، ادخار، ومتعة 🔄",
    "متصرفش أكتر من 20% من دخلك على الكماليات 💅",
    "اكتب كل مصاريفك يوم بيوم ✍️",
    "جرب تعمل تحدي ادخار 5 جنيه يوميًا 💰",
    "لو مش محتاجه دلوقتي، ماتشتريهوش 😅",
    "حدد ميزانية للأكل برة وماتعديهاش 🍔",
    "استخدم تطبيق لترتيب فلوسك زي MyCash 📱",
    "راجع اشتراكاتك الشهرية، في حاجات ممكن تستغنى عنها 📉",
    "استنى 24 ساعة قبل ما تشتري حاجة غالية ⏳",
    "وفر في فواتيرك: طفي النور وافصل الشاحن 💡🔌",
    "ابدأ بهدف ادخار بسيط وخلّيه يكبر كل شهر 📈",
    "اطبخ في البيت بدل ما تطلب دليفري كل يوم 🍽️",
    "لو عندك دخل إضافي، ماتصرفهوش كله – خليه للادخار 🚀",
  ];

  const todayIndex = new Date().getDate() % tips.length;
  const tip = tips[todayIndex];

  const [stats, setStats] = useState({
    points: 0,
    activeGoals: 0,
    expenses: 0,
    income: 0,
    chartData: [],
    user: {},
  });

  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const [goalsRes, summaryRes, expensesRes, profileRes] = await Promise.all([ 
          axios.get("/api/saving-goals", {headers: { Authorization: token },}),
          axios.get("/api/summary", { headers: { Authorization: token } }),
          axios.get("/api/expenses", { headers: { Authorization: token } }),
          axios.get("/api/user/settings/me", { headers: { Authorization: token },}),
        ]);

        const profile = profileRes.data?.data?.user || {};
        const summary = summaryRes.data || {};
        const chartData = summary.transaction_history || [];
        console.log( profile)
        const monthlyTotals = {};
        chartData.forEach((txn) => {
          if (txn.amount && txn.amount > 0 && txn.date) {
            const date = new Date(txn.date);
            const month = date.toLocaleString("ar-EG", { month: "long" });
            monthlyTotals[month] = (monthlyTotals[month] || 0) + txn.amount;
          }         
        });

        const formattedChartData = Object.entries(monthlyTotals)
          .map(([month, value]) => ({ month, value }))
          .sort(
            (a, b) =>
              arabicMonthOrder.indexOf(a.month) -
              arabicMonthOrder.indexOf(b.month)
          );

        setStats({
          points: profile.points || 0,
          activeGoals: goalsRes.data?.data?.length || 0,
          income: summary.current_balance || 0,
          expenses: expensesRes.data?.total_amount || 0,
          chartData: formattedChartData,
          user: profile,
        });

        console.log("Fetched Summary:", summaryRes.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/daily-tasks", { headers: { Authorization: token }, });
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Error fetching daily tasks:", err);
      }
    };

    fetchStats();
    fetchTasks();
  }, []);

  const completeTask = async (taskKey) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`/api/daily-tasks/${taskKey}/complete`, null, { headers: { Authorization: token }, });
      setTasks((prev) =>
        prev.map((t) => (t.key === taskKey ? { ...t, status: "done" } : t))
      );
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

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
            <h2>👋 أهلاً يا {stats.user?.nickname || "صاحبى"}</h2>
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
                {stats.points}
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
                {stats.activeGoals}
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
                {stats.expenses}
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
                {stats.income}
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
            data={stats.chartData}
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
              <span className="tip-text">{tip}</span>
            </div>
          </div>
          {/* <button className="tip-btn">أعرف ليه</button> */}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="tasks-section">
        <div className="tasks-progress-badge">
          مكتمل {Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100)}%
        </div>
        <div className="tasks-header">المهام اليومية</div>
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li
              className={`task-row ${task.status}`}
              key={task.key}
              onClick={() =>
                task.status === "pending" ? completeTask(task.key) : null
              }
            >
              <span className={`task-icon ${task.status}`}>
                {task.status === "done" ? (
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
                ) : (
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
                )}
              </span>
              <span className="task-title">
                <span className={`task-points ${task.status}`}>
                  +{task.points} نقطة
                </span>{" "}
                {task.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
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
        <Link to="/chatbot" className="cta-btn">
          ابدأ التحدث
        </Link>
      </div>
    </Container>
  );
};

export default Home;
