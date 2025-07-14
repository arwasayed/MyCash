import React, { useState } from 'react';
import { CameraIcon, MessageSquareIcon, DollarSignIcon, CheckIcon, CalendarIcon, PenIcon, EditIcon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GoalsPage.css';

const GoalsPage = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'شراء موبايل',
      completed: true,
      targetAmount: 5000,
      currentAmount: 3000,
      remainingAmount: 2000,
      progress: 60,
      color: 'purple'
    },
    {
      id: 2,
      title: 'رحلة صيف',
      completed: false,
      targetAmount: 8000,
      currentAmount: 3200,
      remainingAmount: 4800,
      progress: 40,
      color: 'blue'
    },
    {
      id: 3,
      title: 'لابتوب جديد',
      completed: false,
      targetAmount: 15000,
      currentAmount: 0,
      remainingAmount: 15000,
      progress: 0,
      color: 'green'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    targetDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
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
        color: ['purple', 'blue', 'green', 'orange', 'red'][Math.floor(Math.random() * 5)]
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({ title: '', targetAmount: '', targetDate: '' });
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
          minHeight: 60
        }}
      >
        <div
          className="d-flex flex-row-reverse align-items-center justify-content-between"
          style={{ width: "100%" }}
        >
          <img
            src="/Goals/Icons/Vector.svg"
            alt="هدف"
            style={{}}
          />
          <h2
            className="fw-normal mb-0"
            style={{
              fontSize: "1.35rem",
              color: "#222",
              fontFamily: "Cairo, sans-serif",
              fontWeight: 500
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
            fontWeight: 400
          }}
        >
          أضف أهدافك دورياً أو احصل على خطة ذكية من المساعد
        </p>
      </div>

      <div className="row">
        {/* Goal Form */}
        <div className="col-md-6 mb-4">
          <div className="card p-4 goal-card" style={{ borderRadius: 20, boxShadow: "0 2px 16px 0 #E5E7EB", background: "#fff" }}>
            {/* Header: Icon + Title + Description */}
            <div className="d-flex align-items-start justify-content-start mb-3" style={{ gap: 10 }}>
              <div style={{
                background: "#E8F0FE",
                borderRadius: 12,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 0,
                marginLeft: 8
              }}>
                <img src="/Goals/Icons/Vector(1).svg" alt="هدف" style={{ width: 18, height: 18}} />
              </div>
              <div>
                <h3 className="fw-bold mb-1" style={{ fontSize: "1.15rem", color: "#222", textAlign: "right" }}>
                  أضف هدف يدويًا
                </h3>
                <div className="text-muted" style={{ fontSize: "0.95rem", textAlign: "right" }}>
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
                  style={{ borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB" }}
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
                    style={{ borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB" }}
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
                      style={{ borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                    />
                    <CalendarIcon size={18} className="calendar-icon" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center" style={{ borderRadius: 12, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px 0 #2563EB22' }}>
                <span className="ms-2">حفظ الهدف</span>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: 4 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V17M12 17C12 18.1046 11.1046 19 10 19H6C4.89543 19 4 18.1046 4 17V11C4 9.89543 4.89543 9 6 9H10C11.1046 9 12 9.89543 12 11ZM16 7V7.01M16 11V17C16 18.1046 16.8954 19 18 19H20C21.1046 19 22 18.1046 22 17V11C22 9.89543 21.1046 9 20 9H18C16.8954 9 16 9.89543 16 11Z" /></svg>
              </button>
            </form>
          </div>
        </div>

        {/* Goal Suggestions - Assistant Smart Plan Card */}
        <div className="col-md-6 mb-4">
          <div className="card p-4 goal-card" style={{ borderRadius: 20, boxShadow: "0 2px 16px 0 #E5E7EB", background: "#fff" }}>
            {/* Header: Brain Icon + Title + Bot Icon + Description */}
            <div className="d-flex align-items-start justify-content-between mb-3" style={{ gap: 10 }}>
              {/* أيقونة الدماغ */}
              <div style={{
                background: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.15
              }}>
                {/* استبدل هذا بـ SVG دماغ إذا توفر */}
                <img src="/Goals/Icons/brain.svg" alt="دماغ" style={{ width: 44, height: 44, filter: "grayscale(1)", color: "#6C5DD3" }} />
              </div>
              <div className="flex-grow-1" style={{ textAlign: "right" }}>
                <div className="d-flex align-items-center justify-content-end mb-1" style={{ gap: 8 }}>
                  <div style={{
                    background: "#E8F0FE",
                    borderRadius: 12,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 8
                  }}>
                    <img src="/Goals/Icons/Vector(4).svg" alt="بوت" style={{ width: 18, height: 18 }} />
                  </div>
                  <h3 className="fw-normal mb-0" style={{ fontSize: "1.15rem", color: "#222" }}>احصل على خطة ذكية</h3>
                </div>
                <div className="text-muted" style={{ fontSize: "0.95rem", color: "#A0AEC0" }}>المساعد الذكي سيساعدك</div>
              </div>
            </div>
            {/* Chat Bubbles */}
            <div className="mb-3" style={{ minHeight: 220 }}>
              {/* User message - purple bubble */}
              <div className="d-flex flex-row-reverse align-items-start mb-2">
                <div style={{ background: "#6C5DD3", color: "#fff", borderRadius: 12, padding: "8px 18px", fontWeight: 500, fontSize: "1rem", minWidth: 80, textAlign: "center" }}>
                  3000 جنيه
                </div>
              </div>
              {/* Bot message - white bubble with lamp icon */}
              <div className="d-flex flex-row-reverse align-items-center mb-2">
                <div style={{
                  background: "#6C5DD3",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8
                }}>
                  <img src="/Goals/Icons/Vector(2).svg" alt="لمبة" style={{ width: 16, height: 16 }} />
                </div>
                <div style={{ background: "#F3F4F6", borderRadius: 12, padding: "8px 16px", fontWeight: 500, fontSize: "1rem", color: "#222", marginRight: 0 }}>
                  صديقنا، ادخل دخلك الشهري؟
                </div>
              </div>
              {/* Bot message - white bubble with lamp icon */}
              <div className="d-flex flex-row-reverse align-items-center mb-2">
                <div style={{
                  background: "#6C5DD3",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8
                }}>
                  <img src="/Goals/Icons/Vector(2).svg" alt="لمبة" style={{ width: 16, height: 16 }} />
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: "8px 16px", fontWeight: 500, fontSize: "1rem", color: "#222", marginRight: 0, border: "1px solid #F3F4F6" }}>
                  ممتاز! حابب توصل لهدف ايه؟
                </div>
              </div>
              {/* Suggestion bubble - gradient with lamp and target icon */}
              <div className="d-flex flex-row-reverse align-items-start mb-2">
                <div style={{
                  background: "#6C5DD3",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8,
                  marginTop: 2
                }}>
                  <img src="/Goals/Icons/Vector(2).svg" alt="لمبة" style={{ width: 16, height: 16 }} />
                </div>
                <div style={{
                  background: "linear-gradient(90deg, #F3F4F6 0%, #E8F0FE 100%)",
                  borderRadius: 16,
                  padding: "12px 18px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#222",
                  minWidth: 220,
                  boxShadow: "0 2px 8px 0 #E5E7EB"
                }}>
                  <div className="mb-1" style={{ fontSize: "0.95rem", color: "#6C5DD3", fontWeight: 600, textAlign: 'right' }}>
                    مقترح ليك:
                  </div>
                  <div style={{ fontSize: "0.98rem", color: "#222", display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    ادخر 500 جنيه شهريًا لمدة 10 شهور لشراء موبايل
                    <img src="/Goals/Icons/Vector(3).svg" alt="هدف" style={{ width: 16, height: 16, marginRight: 4, marginBottom: 2 }} />
                  </div>
                  <button className="btn btn-success btn-sm mt-3 d-flex align-items-center" style={{ borderRadius: 8, fontWeight: 600, fontSize: "1rem", padding: "4px 18px", boxShadow: "0 2px 8px 0 #22C55E22" }}>
                    <img src="/Goals/Icons/Vector(5).svg" alt="صح" style={{ width: 16, height: 16, marginLeft: 6 }} />
                    اعتمد الخطة
                  </button>
                </div>
              </div>
            </div>
            {/* Input message */}
            <div className="d-flex align-items-center mt-2" style={{ background: "#F9FAFB", borderRadius: 12, padding: "6px 12px" }}>
              <input type="text" className="form-control border-0 bg-transparent text-end" placeholder="اكتب رسالتك..." style={{ boxShadow: "none", fontSize: "1rem", background: "transparent" }} />
              <button className="btn" style={{ background: "#6C5DD3", color: "#fff", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-6 9 6-9 6-9-6zm0 0v6a9 9 0 009 9 9 9 0 009-9v-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Goals */}
      <div className="mt-5">
        <h2 className="section-title mb-4">أهدافي الحالية</h2>
        <div className="row">
          {goals.map(goal => (
            <div key={goal.id} className="col-md-4 mb-4">
              <div className="card goal-card h-100">
                {goal.completed ? (
                  <div className="card-body text-center bg-success bg-opacity-10">
                    <div className="d-flex justify-content-center mb-3">
                      <div className="completed-icon">
                        <CheckIcon size={32} className="text-success" />
                      </div>
                    </div>
                    <p className="fw-bold mb-2">
                      تم انجاز الهدف بنجاح! 🎉
                    </p>
                    <p className="text-muted mb-0">
                      د.ج {goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className={`card-body bg-${goal.color}-bg`}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">المتبقي</span>
                      <span className="text-muted">المبلغ</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <div className={`text-${goal.color} fw-bold`}>
                        د.ج {goal.remainingAmount.toLocaleString()}
                      </div>
                      <div className="fw-bold">د.ج {goal.targetAmount.toLocaleString()}</div>
                    </div>
                    <div className="progress mb-3">
                      <div
                        className={`progress-bar bg-${goal.color}`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-link text-muted p-0">
                        <EditIcon size={18} />
                      </button>
                      <button className={`btn btn-${goal.color} btn-sm`}>
                        تعديل
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage; 