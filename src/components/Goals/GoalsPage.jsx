import React, { useState } from "react";
import {
  CameraIcon,
  MessageSquareIcon,
  DollarSignIcon,
  CheckIcon,
  CalendarIcon,
  PenIcon,
  EditIcon,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GoalsPage.css";

const GoalsPage = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "شراء موبايل",
      completed: true,
      targetAmount: 5000,
      currentAmount: 3000,
      remainingAmount: 2000,
      progress: 60,
      color: "purple",
    },
    {
      id: 2,
      title: "رحلة صيف",
      completed: false,
      targetAmount: 8000,
      currentAmount: 3200,
      remainingAmount: 4800,
      progress: 40,
      color: "blue",
    },
    {
      id: 3,
      title: "لابتوب جديد",
      completed: false,
      targetAmount: 15000,
      currentAmount: 0,
      remainingAmount: 15000,
      progress: 0,
      color: "green",
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitGoal = (e) => {
    e.preventDefault();
    if (newGoal.title && newGoal.targetAmount) {
      const goal = {
        id: goals.length + 1,
        title: newGoal.title,
        completed: false,
        targetAmount: parseInt(newGoal.targetAmount),
        currentAmount: 0,
        remainingAmount: parseInt(newGoal.targetAmount),
        progress: 0,
        color: ["purple", "blue", "green", "orange", "red"][
          Math.floor(Math.random() * 5)
        ],
      };
      setGoals((prev) => [...prev, goal]);
      setNewGoal({ title: "", targetAmount: "", targetDate: "" });
    }
  };

  return (
    <div className="mx-auto px-4 py-6 goals-page">
      {/* Goals Header Section - مطابق للصورة الأولى */}
      <div
        className="goals-header-section py-4 px-3 mb-4"
        style={{
          background: "#F7F8FA",
          borderRadius: "0 0 12px 12px",
          minHeight: 60,
        }}
      >
        <div
          className="d-flex flex-row-reverse align-items-center justify-content-between"
          style={{ width: "100%" }}
        >
          <img src="/Goals/Icons/Vector.svg" alt="هدف" style={{}} />
          <h2
            className="fw-normal mb-0"
            style={{
              fontSize: "1.35rem",
              color: "#222",
              fontFamily: "Cairo, sans-serif",
              fontWeight: 500,
            }}
          >
            أهدافي المالية
          </h2>
        </div>
        <p
          className="text-end mt-2 mb-0"
          style={{
            color: "#6B7280",
            fontSize: "0.95rem",
            fontFamily: "Cairo, sans-serif",
            fontWeight: 400,
          }}
        >
          أضف أهدافك دورياً أو احصل على خطة ذكية من المساعد
        </p>
      </div>

      {/* الكاردين جنب بعض */}
      <div className="goals-cards-wrapper">
        <div className="goal-card">
          {/* كارد أضف هدف يدويًا */}
          <div
            className="card p-4 goal-card"
            style={{
              borderRadius: 20,
              boxShadow: "0 2px 16px 0 #E5E7EB",
              background: "#fff",
            }}
          >
            {/* Header: Icon + Title + Description */}
            <div
              className="d-flex align-items-start justify-content-start mb-3"
              style={{ gap: 10 }}
            >
              <div
                style={{
                  background: "#E8F0FE",
                  borderRadius: 12,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 0,
                  marginLeft: 8,
                }}
              >
                <img
                  src="/Goals/Icons/Vector(1).svg"
                  alt="هدف"
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <div>
                <h3
                  className="fw-bold mb-1"
                  style={{
                    fontSize: "1.15rem",
                    color: "#222",
                    textAlign: "right",
                  }}
                >
                  أضف هدف يدويًا
                </h3>
                <div
                  className="text-muted"
                  style={{ fontSize: "0.95rem", textAlign: "right" }}
                >
                  حدد أهدافك المالي بنفسك
                </div>
              </div>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmitGoal} dir="rtl">
              <div className="mb-3">
                <label className="form-label">اسم الهدف</label>
                <input
                  type="text"
                  name="title"
                  value={newGoal.title}
                  onChange={handleInputChange}
                  placeholder="مثال: شراء موبايل جديد"
                  className="form-control text-end"
                  style={{
                    borderRadius: 12,
                    background: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                  }}
                />
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label">المبلغ المطلوب</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={newGoal.targetAmount}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="form-control text-end"
                    style={{
                      borderRadius: 12,
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">التاريخ المستهدف</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      name="targetDate"
                      value={newGoal.targetDate}
                      onChange={handleInputChange}
                      placeholder="mm/dd/yyyy"
                      className="form-control text-end pe-4"
                      style={{
                        borderRadius: 12,
                        background: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                      }}
                    />
                    <CalendarIcon
                      size={18}
                      className="calendar-icon"
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#A0AEC0",
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn w-100 d-flex align-items-center justify-content-center"
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 8px 0 #2563EB22",
                  flexDirection: "row-reverse",
                  gap: 8,
                }}
              >
                <span className="ms-2">حفظ الهدف</span>
                <img
                  src="/Goals/Icons/Vector(9).svg"
                  alt="حفظ"
                  style={{ width: 18, height: 18, marginLeft: 6 }}
                />
              </button>
            </form>
          </div>
        </div>

        {/* كارد احصل على خطة ذكية */}
        <div className="goal-card">
          <div
            className="card p-4 goal-card"
            style={{
              borderRadius: 20,
              boxShadow: "0 2px 16px 0 #E5E7EB",
              background: "#fff",
            }}
          >
            {/* رأس الشات: العنوان مع أيقونة الروبوت على اليمين، الوصف تحته */}
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                gap: 12,
                marginBottom: 8,
              }}
            >
              {/* النصوص فوق بعض */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                }}
              >
                <h3
                  className="fw-normal mb-0"
                  style={{ fontSize: "1.15rem", color: "#222" }}
                >
                  احصل على خطة ذكية
                </h3>
                <p
                  className="mb-1"
                  style={{
                    color: "#A0AEC0",
                    fontSize: "0.95rem",
                    marginBottom: 0,
                    marginTop: 4,
                  }}
                >
                  المساعد الذكي سيساعدك
                </p>
              </div>
              {/* أيقونة الروبوت */}
              <div
                style={{
                  background: "#F1F1FB",
                  borderRadius: 12,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/Goals/Icons/Vector(3).svg"
                  alt="مساعد"
                  style={{ width: 20, height: 20 }}
                />
              </div>
            </div>
            {/* أيقونة العقل الكبيرة في أقصى اليسار */}
            <div style={{ position: "absolute", left: 24, top: 24, zIndex: 1 }}>
              <img
                src="/Goals/Icons/Vector(2).svg"
                alt="عقل"
                style={{ width: 56, height: 56, opacity: 0.15 }}
              />
            </div>
            {/* محتوى الكارد الرئيسي */}
            <div
              className="chat-section"
              style={{
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* رسالة المساعد 1 */}
              <div
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    background: "#6C5DD3",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/Goals/Icons/Vector(3).svg"
                    alt="مساعد"
                    style={{
                      width: 20,
                      height: 20,
                      filter: "invert(1) brightness(1000%)",
                    }}
                  />
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "10px 18px",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#222",
                    boxShadow: "0 1px 4px #E5E7EB33",
                  }}
                >
                  صديقنا، ادخل دخلك الشهري؟
                </div>
              </div>
              {/* دخل المستخدم */}
              <div
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    background: "#6C5DD3",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontWeight: 500,
                    fontSize: "1rem",
                    minWidth: 80,
                    textAlign: "center",
                  }}
                >
                  3000 جنيه
                </div>
              </div>
              {/* رسالة المساعد 2 */}
              <div
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    background: "#6C5DD3",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/Goals/Icons/Vector(3).svg"
                    alt="مساعد"
                    style={{
                      width: 20,
                      height: 20,
                      filter: "invert(1) brightness(1000%)",
                    }}
                  />
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "10px 18px",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#222",
                    boxShadow: "0 1px 4px #E5E7EB33",
                  }}
                >
                  ممتاز! جايب توصل لهدف ايه؟
                </div>
              </div>
              {/* فقاعة الاقتراح */}
              <div
                style={{
                  alignSelf: "flex-start",
                  background:
                    "linear-gradient(to left, #00C48C1A 10%, #6C5DD31A 90%)",
                  borderRadius: 16,
                  padding: "16px 18px 12px 18px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#222",
                  minWidth: 220,
                  boxShadow: "0 2px 8px 0 #E5E7EB",
                  border: "1.5px solid #E0E7EF",
                  marginTop: 0,
                  marginBottom: 0,
                  direction: "rtl",
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "#6C5DD3",
                      fontWeight: 600,
                    }}
                  >
                    مقترحي ليك:
                  </span>
                  <img
                    src="/Goals/Icons/Vector(4).svg"
                    alt="لمبة"
                    style={{ width: 18, height: 18 }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "1.05rem",
                    color: "#222",
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  ادخر 500 جنيه شهريًا لمدة 10 شهور لشراء موبايل
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className="btn w-auto px-4"
                    style={{
                      background: "#00C48C",
                      color: "#fff",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: "1rem",
                      display: "flex",
                      flexDirection: "row-reverse",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "none",
                    }}
                  >
                    اعتمد الخطة
                    <img
                      src="/Goals/Icons/Vector(5).svg"
                      alt="صح"
                      style={{ width: 16, height: 16 }}
                    />
                  </button>
                </div>
              </div>
            </div>
            {/* Input message */}
            <div
              className="d-flex align-items-center mt-3"
              style={{
                background: "#F9FAFB",
                borderRadius: 12,
                padding: "6px 12px",
              }}
            >
              <input
                type="text"
                className="form-control border-0 bg-transparent text-end"
                placeholder="اكتب رسالتك..."
                style={{
                  boxShadow: "none",
                  fontSize: "1rem",
                  background: "transparent",
                }}
              />
              <button
                className="btn"
                style={{
                  background: "#6C5DD3",
                  color: "#fff",
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                <img
                  src="/Goals/Icons/Vector(6).svg"
                  alt="إرسال"
                  style={{ width: 18, height: 18 }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Goals */}
      <div className="mt-5">
        <h2 className="section-title mb-4">أهدافي المالية 🎯</h2>
        <div className="goals-list-wrapper center-3-cards">
          {goals.slice(0, 3).map((goal, idx) =>
            idx === 0 ? (
              <div
                key={goal.id}
                className="goal-card-custom goal-card-purple goal-card-progress goal-card-figma"
              >
                {/* badge ذكي */}
                <div className="goal-badge-smart">
                  <img
                    src="/Goals/Icons/Vector(3).svg"
                    alt="مساعد"
                    className="goal-badge-icon"
                  />
                  <span>ذكي</span>
                </div>
                {/* اسم الهدف */}
                <div className="goal-title-figma">{goal.title}</div>
                {/* دائرة التقدم */}
                <div className="goal-progress-circle-figma">
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle
                      cx="45"
                      cy="45"
                      r="40"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="7"
                    />
                    <circle
                      cx="45"
                      cy="45"
                      r="40"
                      fill="none"
                      stroke="#6C5DD3"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={
                        (1 - goal.progress / 100) * 2 * Math.PI * 40
                      }
                      style={{ transition: "stroke-dashoffset 0.5s" }}
                    />
                    <text
                      x="50%"
                      y="54%"
                      textAnchor="middle"
                      fontSize="1.5rem"
                      fill="#6C5DD3"
                      fontWeight="bold"
                    >
                      {goal.progress}%
                    </text>
                  </svg>
                </div>
                {/* الأرقام */}
                <div className="goal-amounts-figma">
                  <div>
                    <span className="goal-label">المبلغ:</span>
                    <span className="goal-value">
                      {goal.targetAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="goal-label">المتحقق:</span>
                    <span className="goal-value goal-value-green">
                      {goal.currentAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="goal-label">المتبقي:</span>
                    <span className="goal-value goal-value-red">
                      {goal.remainingAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
                {/* الأزرار */}
                <div className="goal-actions-figma">
                  <button className="goal-delete-btn-figma">
                    <img
                      src="/Goals/Icons/Frame(3).svg"
                      alt="حذف"
                      style={{ width: "22px", height: "22px" }}
                    />
                  </button>
                  <button className="goal-edit-btn-figma">
                    <svg width="20" height="20" viewBox="0 0 18 18">
                      <path
                        d="M2 14.5V16h1.5l8.06-8.06-1.5-1.5L2 14.5zM15.41 6.09a1 1 0 0 0 0-1.41l-2.09-2.09a1 1 0 0 0-1.41 0l-1.13 1.13 3.5 3.5 1.13-1.13z"
                        fill="#fff"
                      />
                    </svg>
                    تعديل
                  </button>
                </div>
              </div>
            ) : idx === 1 ? (
              <div
                key={goal.id}
                className="goal-card-custom goal-card-blue goal-card-progress goal-card-figma goal-card-blue-gradient"
              >
                {/* badge يدوي */}
                <div className="goal-badge-manual">
                  <img
                    src="/Goals/Icons/Vector(1).svg"
                    alt="يدوي"
                    className="goal-badge-icon"
                  />
                  <span>يدوي</span>
                </div>
                {/* اسم الهدف */}
                <div className="goal-title-figma">{goal.title}</div>
                {/* دائرة التقدم */}
                <div className="goal-progress-circle-figma">
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle
                      cx="45"
                      cy="45"
                      r="40"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="7"
                    />
                    <circle
                      cx="45"
                      cy="45"
                      r="40"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={
                        (1 - goal.progress / 100) * 2 * Math.PI * 40
                      }
                      style={{ transition: "stroke-dashoffset 0.5s" }}
                    />
                    <text
                      x="50%"
                      y="54%"
                      textAnchor="middle"
                      fontSize="1.5rem"
                      fill="#2563EB"
                      fontWeight="bold"
                    >
                      {goal.progress}%
                    </text>
                  </svg>
                </div>
                {/* الأرقام */}
                <div className="goal-amounts-figma">
                  <div>
                    <span className="goal-label">المبلغ:</span>
                    <span className="goal-value">
                      {goal.targetAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="goal-label">المتحقق:</span>
                    <span className="goal-value goal-value-green">
                      {goal.currentAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="goal-label">المتبقي:</span>
                    <span className="goal-value goal-value-red">
                      {goal.remainingAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
                {/* الأزرار */}
                <div className="goal-actions-figma">
                  <button className="goal-delete-btn-figma">
                    <img
                      src="/Goals/Icons/Frame(3).svg"
                      alt="حذف"
                      style={{ width: "22px", height: "22px" }}
                    />
                  </button>
                  <button className="goal-edit-btn-figma goal-edit-btn-blue">
                    <svg width="20" height="20" viewBox="0 0 18 18">
                      <path
                        d="M2 14.5V16h1.5l8.06-8.06-1.5-1.5L2 14.5zM15.41 6.09a1 1 0 0 0 0-1.41l-2.09-2.09a1 1 0 0 0-1.41 0l-1.13 1.13 3.5 3.5 1.13-1.13z"
                        fill="#fff"
                      />
                    </svg>
                    تعديل
                  </button>
                </div>
              </div>
            ) : idx === 2 ? (
              <div
                key={goal.id}
                className="goal-card-custom goal-card-green goal-card-done goal-card-done-figma"
              >
                {/* badge مكتمل */}
                <div className="goal-badge-done">
                  <img
                    src="/Goals/Icons/Vector(5).svg"
                    alt="مكتمل"
                    className="goal-badge-icon"
                  />
                  <span>مكتمل</span>
                </div>
                {/* اسم الهدف */}
                <div className="goal-title-figma">{goal.title}</div>
                {/* دائرة الصح الكبيرة */}
                <div className="goal-check-figma">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="60"
                      fill="#00C48C"
                      fillOpacity="0.15"
                    />
                    <path
                      d="M38 62l18 18 26-26"
                      stroke="#fff"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {/* نص التهنئة */}
                <div className="goal-done-msg-figma">
                  <span role="img" aria-label="تهنئة">
                    🎉
                  </span>{" "}
                  تم إنجاز الهدف بنجاح!
                </div>
                {/* المبلغ */}
                <div className="goal-done-amount">
                  {goal.targetAmount.toLocaleString()} ج.م
                </div>
              </div>
            ) : (
              <div
                key={goal.id}
                className={`goal-card-custom ${
                  goal.completed ? "goal-card-done" : "goal-card-progress"
                } goal-card-${goal.color}`}
              >
                {/* شارة أعلى الكارت */}
                <div className="goal-badge">
                  {goal.completed ? "منجز" : goal.title}
                </div>
                {/* دائرة التقدم أو علامة الصح */}
                <div className="goal-progress-circle">
                  {goal.completed ? (
                    <div className="goal-check">
                      <svg width="56" height="56" viewBox="0 0 56 56">
                        <circle
                          cx="28"
                          cy="28"
                          r="28"
                          fill="#00C48C"
                          opacity="0.12"
                        />
                        <path
                          d="M18 29l7 7 13-13"
                          stroke="#00C48C"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <svg width="56" height="56" viewBox="0 0 56 56">
                      <circle
                        cx="28"
                        cy="28"
                        r="26"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="26"
                        fill="none"
                        stroke={
                          goal.color === "purple"
                            ? "#6C5DD3"
                            : goal.color === "blue"
                            ? "#2563EB"
                            : "#00C48C"
                        }
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          (1 - goal.progress / 100) * 2 * Math.PI * 26
                        }
                        style={{ transition: "stroke-dashoffset 0.5s" }}
                      />
                      <text
                        x="50%"
                        y="54%"
                        textAnchor="middle"
                        fontSize="1.1rem"
                        fill={
                          goal.color === "purple"
                            ? "#6C5DD3"
                            : goal.color === "blue"
                            ? "#2563EB"
                            : "#00C48C"
                        }
                        fontWeight="bold"
                      >
                        {goal.progress}%
                      </text>
                    </svg>
                  )}
                </div>
                {/* اسم الهدف */}
                {!goal.completed && (
                  <div className="goal-title">{goal.title}</div>
                )}
                {/* أرقام الهدف */}
                <div className="goal-amounts">
                  <div>
                    <span>المبلغ</span>
                    <span>د.ج {goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span>المتحقق</span>
                    <span>د.ج {goal.currentAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span>المتبقي</span>
                    <span>د.ج {goal.remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
                {/* زرار تعديل وحذف */}
                <div className="goal-actions">
                  <button className="goal-edit-btn">
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M2 14.5V16h1.5l8.06-8.06-1.5-1.5L2 14.5zM15.41 6.09a1 1 0 0 0 0-1.41l-2.09-2.09a1 1 0 0 0-1.41 0l-1.13 1.13 3.5 3.5 1.13-1.13z"
                        fill="currentColor"
                      />
                    </svg>
                    تعديل
                  </button>
                  <button className="goal-delete-btn">
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M6 7v6m3-6v6m3-9v1H6V4m9 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5h12z"
                        stroke="#A0AEC0"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </button>
                </div>
                {/* تهنئة في الكارت المكتمل */}
                {goal.completed && (
                  <div className="goal-done-msg">
                    تم انجاز الهدف بنجاح! 🎉
                    <br />
                    د.ج {goal.targetAmount.toLocaleString()}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
