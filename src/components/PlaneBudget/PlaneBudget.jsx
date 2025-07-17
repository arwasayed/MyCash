import React, { useState, useEffect } from "react";
import "./PlaneBudget.css";

const initialExpenses = [{ id: 1, category: "الصنع", amount: "" }];

export default function PlaneBudget() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [newCategory, setNewCategory] = useState("الصنع");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  
  const percent = income
    ? Math.min(100, Math.round((totalExpenses / Number(income)) * 100))
    : 0;

  useEffect(() => {
    const loggedInUserId = "686bd4ac75316db54595192e";
    setUserId(loggedInUserId);
    
    if (loggedInUserId) {
      fetchExpenses(loggedInUserId);
    }
  }, []);

  const fetchExpenses = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/expenses?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }
      
      const data = await response.json();
      setExpenses(data.expenses.map(exp => ({
        id: exp.id,
        category: exp.category,
        amount: exp.amount.toString()
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExpense = async (id) => {
    setIsLoading(true);
    try {
      const expenseToUpdate = expenses.find(e => e.id === id);
      
      if (!expenseToUpdate || !expenseToUpdate.amount || !expenseToUpdate.category) {
        throw new Error('يجب إدخال المبلغ والفئة');
      }
      
      const response = await fetch(`http://localhost:3000/api/expense/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Number(expenseToUpdate.amount),
          category: expenseToUpdate.category
        })
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث المصروف');
      }
      
      // تحديث الحالة المحلية مباشرة بدون الحاجة لـ refresh
      setExpenses(prevExpenses => 
        prevExpenses.map(exp => 
          exp.id === id 
            ? { ...exp, amount: expenseToUpdate.amount, category: expenseToUpdate.category }
            : exp
        )
      );
      
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now(), category: newCategory, amount: "" },
    ]);
  };

  const handleRemoveExpense = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/expense/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في حذف المصروف');
      }
      
      setExpenses(prevExpenses => prevExpenses.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseChange = (id, value) => {
    setExpenses(prevExpenses =>
      prevExpenses.map((exp) =>
        exp.id === id ? { ...exp, amount: value } : exp
      )
    );
  };

  const handleCategoryChange = (id, value) => {
    setExpenses(prevExpenses =>
      prevExpenses.map((exp) =>
        exp.id === id ? { ...exp, category: value } : exp
      )
    );
  };

  const handleSave = async () => {
    if (!userId || !income) {
      alert('يجب إدخال الدخل الشهري أولاً');
      return;
    }
    
    setIsLoading(true);
    try {
      const incomeResponse = await fetch('http://localhost:3000/api/income', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          amount: Number(income),
          frequency: 'monthly',
          description: 'الدخل الشهري'
        })
      });
      
      if (!incomeResponse.ok) {
        throw new Error('فشل في حفظ الدخل');
      }
      
      for (const expense of expenses) {
        if (expense.amount && expense.category) {
          const response = await fetch('http://localhost:3000/api/expense', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: userId,
              amount: Number(expense.amount),
              category: expense.category,
              description: expense.description || ''
            })
          });
          
          if (!response.ok) {
            throw new Error('فشل في حفظ المصروف');
          }
        }
      }
      
      alert('تم حفظ الخطة بنجاح!');
      fetchExpenses(userId); // إعادة جلب البيانات للتأكد من المزامنة
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
          {expenses.map((exp) => (
            <div className="plane-budget-expense-row" key={exp.id}>
              <select
                className="plane-budget-category-select"
                value={exp.category}
                onChange={(e) => handleCategoryChange(exp.id, e.target.value)}
                disabled={isLoading && editingId !== exp.id}
              >
                <option value="" disabled>اختر البند</option>
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
                disabled={isLoading && editingId !== exp.id}
              />
              {editingId === exp.id ? (
                <button
                  type="button"
                  className="plane-budget-save-btn"
                  onClick={() => handleUpdateExpense(exp.id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الحفظ...' : '💾 حفظ'}
                </button>
              ) : (
                <button
                  type="button"
                  className="plane-budget-edit-btn"
                  onClick={() => setEditingId(exp.id)}
                  disabled={isLoading}
                >
                  <img 
                    src="/Plane/Icons/edit.svg" 
                    alt="edit" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black' width='24px' height='24px'><path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/></svg>";
                    }}
                  />
                </button>
              )}
              <button
                type="button"
                className="plane-budget-remove-btn"
                onClick={() => handleRemoveExpense(exp.id)}
                disabled={isLoading}
              >
                <img src="/Plane/Icons/Vector(1).svg" alt="remove" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="plane-budget-add-btn"
            onClick={handleAddExpense}
            disabled={isLoading}
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
          disabled={isLoading}
        >
          {isLoading ? 'جاري الحفظ...' : '✨ حفظ الخطة'}
        </button>
      </form>
      {error && <div className="plane-budget-error">{error}</div>}
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
