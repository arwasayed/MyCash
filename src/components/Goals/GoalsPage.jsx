import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GoalsPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GoalCard from "../GoalCard/GoalCard";
import { useNavigate } from "react-router-dom";

const GoalsPage = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/chatbot");
  };
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
  });
  const [editGoalId, setEditGoalId] = useState(null);
  const [editGoalData, setEditGoalData] = useState({
    currentAmount: "",
  });

  const startEdit = (goal) => {
    setEditGoalId(goal.id);
    setEditGoalData({ currentAmount: goal.currentAmount });
  };

  const handleCancelEdit = () => {
    setEditGoalId(null);
    setEditGoalData({});
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.patch(
        `/api/saving-goals/${editGoalId}`,
        { currentAmount: Number(editGoalData.currentAmount) },
        { headers: { Authorization: token } }
      );

      const updated = res.data.data;
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editGoalId
            ? {
                ...g,
                currentAmount: updated.currentAmount,
                remainingAmount: updated.targetAmount - updated.currentAmount,
                progress: Math.round(
                  (updated.currentAmount / updated.targetAmount) * 100
                ),
                completed: updated.status === "completed",
              }
            : g
        )
      );
      setEditGoalId(null);
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/saving-goals", { headers: { Authorization: token } })
      .then((res) => {
        const fetchedGoals = res.data.data.map((g) => ({
          id: g._id,
          title: g.title,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          remainingAmount:
            g.targetAmount - g.currentAmount > 0
              ? g.targetAmount - g.currentAmount
              : 0,
          progress: Math.round((g.currentAmount / g.targetAmount) * 100),
          completed: g.status === "completed",
          color: "blue",
        }));
        setGoals(fetchedGoals);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();

    try {
      const goalData = {
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        deadline: new Date(newGoal.targetDate),
      };

      const res = await axios.post("/api/saving-goals", goalData, {
        headers: { Authorization: token },
      });
      const g = res.data.data;
      const newGoalObj = {
        id: g._id,
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        remainingAmount:
          g.targetAmount - g.currentAmount > 0
            ? g.targetAmount - g.currentAmount
            : 0,
        progress: Math.round((g.currentAmount / g.targetAmount) * 100),
        completed: g.status === "completed",
        type: "blue", 
      };
      setGoals((prevGoals) => [newGoalObj, ...prevGoals]);
      setNewGoal({ title: "", targetAmount: "", targetDate: "" });
    } catch (err) {
      console.error(
        "❌ Failed to save goal:",
        err.response?.data?.message || err.message
      );      
    }
  };

  const handleEdit = (id, newAmount) => {
    axios
      .patch(
        `/api/saving-goals/${id}`,
        { currentAmount: newAmount },
        {
          headers: { Authorization: `Bearer ${yourToken}` },
        }
      )
      .then((res) => {
        const updatedGoal = res.data.data;
        setGoals((prev) =>
          prev.map((g) =>
            g.id === id
              ? {
                  ...g,
                  currentAmount: updatedGoal.currentAmount,
                  remainingAmount:
                    updatedGoal.targetAmount - updatedGoal.currentAmount,
                  progress: Math.round(
                    (updatedGoal.currentAmount / updatedGoal.targetAmount) * 100
                  ),
                  completed: updatedGoal.status === "completed",
                }
              : g
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`/api/saving-goals/${id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        setGoals(goals.filter((goal) => goal.id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
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
            أهدافي المالية 🎯
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
      <div
        className="goals-cards-wrapper "
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "60px",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <div
          className="goal-card"
          style={{
            flex: "1 1 45%",
            maxWidth: "520px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* كارد أضف هدف يدويًا */}
          <div
            className="card p-4 goal-card "
            style={{
              borderRadius: 20,
              boxShadow: "0 2px 16px 0 #E5E7EB",
              background: "#fff",
              maxWidth: "520px",
              width: "100%",
            }}
          >
            {/* Header: Icon + Title + Description */}
            <div
              className="d-flex align-items-start justify-content-start mb-3 "
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
              <div className="row mb-3" style={{ marginTop: "11%" }}>
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
                    <DatePicker
                      selected={
                        newGoal.targetDate ? new Date(newGoal.targetDate) : null
                      }
                      onChange={(date) =>
                        setNewGoal((prev) => ({ ...prev, targetDate: date }))
                      }
                      placeholderText="اختر التاريخ"
                      className="form-control text-end pe-4"
                      dateFormat="MM/dd/yyyy"
                      style={{
                        borderRadius: 12,
                        background: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                      }}
                    />
                    <CalendarIcon
                      size={18}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#A0AEC0",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn w-100 d-flex align-items-center justify-content-center "
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 8px 0 #2563EB22",
                  flexDirection: "row-reverse",
                  gap: 8,
                  marginTop: "27%",
                  marginBottom: "5%",
                  padding: "10px",
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
        <div
          className="goal-card"
          style={{
            flex: "1 1 45%",
            maxWidth: "520px",
            display: "flex",
            flexDirection: "column",            
          }}
        >
          <div
            className="card p-4 goal-card"
            style={{
              borderRadius: 20,
              boxShadow: "0 2px 16px 0 #E5E7EB",
              background: "#fff",
              maxWidth: "520px",
              width: "100%",
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
                    marginTop:"4%",
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
                      pointerEvents: "none",
                      cursor: "not-allowed",
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
                placeholder="اضغط على السهم للذهاب للمساعد الذكي"
                disabled // ✅ Prevent input
                style={{
                  boxShadow: "none",
                  fontSize: "1rem",
                  background: "transparent",
                  color: "#A0AEC0",
                  cursor: "not-allowed",
                }}
              />
              <button
                className="btn"
                onClick={handleRedirect}
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
        <h2 className="section-title mb-4">أهدافي الحالية</h2>
        <div className="goals-list-wrapper center-3-cards row g-4">
          {goals.map((goal, idx) => {
            const type = goal.completed
              ? "done"
              : idx === 0
              ? "smart"
              : "manual";
            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                type={type}
                onDelete={() => handleDelete(goal.id)}
                onEdit={() => startEdit(goal)}
                isEditing={editGoalId === goal.id}
                editGoalData={editGoalData}
                setEditGoalData={setEditGoalData}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
