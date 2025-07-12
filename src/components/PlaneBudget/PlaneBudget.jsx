import React, { useState } from "react";
import "./PlaneBudget.css";

const initialExpenses = [{ id: 1, category: "الصنع", amount: "" }];

export default function PlaneBudget() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [newCategory, setNewCategory] = useState("الصنع");

  // حساب إجمالي المصروفات
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  // حساب النسبة
  const percent = income
    ? Math.min(100, Math.round((totalExpenses / Number(income)) * 100))
    : 0;

  // إضافة بند جديد
  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now(), category: newCategory, amount: "" },
    ]);
  };

  // حذف بند
  const handleRemoveExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // تغيير قيمة بند
  const handleExpenseChange = (id, value) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, amount: value } : e))
    );
  };

  // تغيير التصنيف
  const handleCategoryChange = (id, value) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, category: value } : e))
    );
  };

  // حفظ الخطة (حاليًا فقط alert)
  const handleSave = () => {
    alert("تم حفظ الخطة!");
  };

  return (
    <div className="plane-budget-container">
      <h2 className="plane-budget-title">
        ظبط ميزانيتك بنفسك{" "}
        <span role="img" aria-label="edit">
          ✍️💸
        </span>
      </h2>
      <div className="plane-budget-subtitle">
        قسم دخلك زي ما تحب... وراقب التزامك بكل بند!
      </div>
      <div className="plane-budget-img-wrapper">
        <img
          src="/Plane/Image/Plane.png"
          alt="Plane"
          className="plane-budget-img"
        />
      </div>
      <form className="plane-budget-form">
        <div className="plane-budget-form-title">
          <img src="/Plane/Icons/Frame(1).svg" alt="add" />
          أدخل خطتك المالية
        </div>
        <div className="plane-budget-input-group">
          <label>💰 دخلك الشهري</label>
          <input
            type="number"
            placeholder="ادخل دخلك الشهري"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="plane-budget-input"
          />
        </div>
        <div className="plane-budget-expenses-section">
          <div className="plane-budget-expenses-title">+ بنود الإنفاق</div>
          {expenses.map((exp, idx) => (
            <div className="plane-budget-expense-row" key={exp.id}>
              <select
                className="plane-budget-category-select"
                value={exp.category}
                onChange={(e) => handleCategoryChange(exp.id, e.target.value)}
              >
                <option value="" disabled>
                  اختر البند
                </option>
                <option value="الصنع">الصنع</option>
                <option value="المواصلات">المواصلات</option>
                <option value="الترفيه">الترفيه</option>
                <option value="فواتير">فواتير</option>
                <option value="أخرى">أخرى</option>
              </select>
              <input
                type="number"
                className="plane-budget-expense-input"
                placeholder="المبلغ"
                value={exp.amount}
                onChange={(e) => handleExpenseChange(exp.id, e.target.value)}
              />
              <button
                type="button"
                className="plane-budget-remove-btn"
                onClick={() => handleRemoveExpense(exp.id)}
              >
                <img src="/Plane/Icons/Vector(1).svg" alt="remove" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="plane-budget-add-btn"
            onClick={handleAddExpense}
          >
            <img src="/Plane/Icons/Vector.svg" alt="add" />
            إضافة بند جديد
          </button>
        </div>
        <div className="plane-budget-progress-bar-wrapper">
          <div className="plane-budget-progress-bar-row">
            <span className="plane-budget-progress-label-right">
              إجمالى التوزيع:
            </span>
            <span className="plane-budget-progress-label-left">{percent}%</span>
          </div>
        </div>
        <button
          type="button"
          className="plane-budget-save-btn"
          onClick={handleSave}
        >
          {" "}
          ✨ حفظ الخطة
        </button>
      </form>
      <div className="plane-budget-summary-card">
        <div className="plane-budget-summary-icon">
          <img src="/Plane/Icons/svg(7).svg" alt="icon" />
        </div>
        <div className="plane-budget-summary-title">
          أداء ممتاز! كلة تحت السيطرة{" "}
          <span role="img" aria-label="fire">
            🔥
          </span>
        </div>
        <div className="plane-budget-summary-desc">
          استمر على هذا الأداء الرائع في إدارة ميزانيتك
        </div>
      </div>
    </div>
  );
}
