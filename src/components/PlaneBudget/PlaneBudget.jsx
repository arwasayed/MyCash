import React, { useState, useEffect } from "react";
import "./PlaneBudget.css";

export default function PlaneBudget() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [newCategory, setNewCategory] = useState("الصنع");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [initialData, setInitialData] = useState({
    income: "",
    expenses: []
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showOverspendingAlert, setShowOverspendingAlert] = useState(false);

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  
  const percent = income
    ? Math.min(100, Math.round((totalExpenses / Number(income)) * 100))
    : 0;

  // Check for overspending
  useEffect(() => {
    if (income && totalExpenses > Number(income)) {
      setShowOverspendingAlert(true);
    } else {
      setShowOverspendingAlert(false);
    }
  }, [income, totalExpenses]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const loggedInUserId = user?.id;
    setUserId(loggedInUserId);
    
    if (loggedInUserId) {
      fetchFinancialData(loggedInUserId);
    }
  }, []);

  useEffect(() => {
    // Check if there are changes compared to initial data
    const incomeChanged = income !== initialData.income;
    const expensesChanged = JSON.stringify(expenses) !== JSON.stringify(initialData.expenses);
    
    setHasChanges(incomeChanged || expensesChanged);
  }, [income, expenses, initialData]);

  const fetchFinancialData = async (userId) => {
    setIsLoading(true);
    try {
      // Fetch current balance (income)
      const incomeResponse = await fetch(`http://localhost:3000/api/balance`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });
      
      if (incomeResponse.ok) {
        const incomeData = await incomeResponse.json();
        const currentIncome = incomeData.current_balance.toString();
        setIncome(currentIncome);
        setInitialData(prev => ({ ...prev, income: currentIncome }));
      }

      // Fetch existing expenses
      const expensesResponse = await fetch(`http://localhost:3000/api/expenses`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });
      
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json();
        const formattedExpenses = expensesData.expenses.map(exp => ({
          id: exp.id,
          category: exp.category,
          amount: exp.amount.toString()
        }));
        
        setExpenses(formattedExpenses);
        setInitialData(prev => ({ ...prev, expenses: formattedExpenses }));
      }
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
          'Authorization': `${localStorage.getItem('token')}`,
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
      
      // Update local state
      setExpenses(prevExpenses => 
        prevExpenses.map(exp => 
          exp.id === id 
            ? { ...exp, amount: expenseToUpdate.amount, category: expenseToUpdate.category }
            : exp
        )
      );
      
      // Refresh initial data
      fetchFinancialData(userId);
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
      { id: `new-${Date.now()}`, category: newCategory, amount: "" },
    ]);
  };

  const handleRemoveExpense = async (id) => {
    setIsLoading(true);
    try {
      // Only delete from backend if it's an existing expense
      if (!id.startsWith('new-')) {
        const response = await fetch(`http://localhost:3000/api/expense/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': ` ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('فشل في حذف المصروف');
        }
      }
      
      // Remove from local state
      setExpenses(prevExpenses => prevExpenses.filter((e) => e.id !== id));
      
      // Refresh data
      fetchFinancialData(userId);
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
    if (!hasChanges) {
      alert('لا يوجد تغييرات لحفظها');
      return;
    }
    
    if (showOverspendingAlert) {
      const confirmSave = window.confirm("المصروفات اكتر من دخلك! هل تريد الاستمرار في الحفظ؟");
      if (!confirmSave) return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let savedIncome = false;
      let savedExpenses = false;
      
      // Save income if changed
      if (income !== initialData.income) {
        const incomeResponse = await fetch('http://localhost:3000/api/income', {
          method: 'POST',
          headers: {
            'Authorization': ` ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Number(income),
            frequency: 'monthly',
            description: 'الدخل الشهري'
          })
        });
        
        if (!incomeResponse.ok) {
          throw new Error('فشل في حفظ الدخل');
        }
        
        savedIncome = true;
      }
      
      // Save expenses
      const newExpenses = expenses.filter(exp => exp.id.startsWith('new-') && exp.amount && exp.category);
      const existingExpenses = expenses.filter(exp => !exp.id.startsWith('new-'));
      
      if (newExpenses.length > 0) {
        for (const expense of newExpenses) {
          const response = await fetch('http://localhost:3000/api/expense', {
            method: 'POST',
            headers: {
              'Authorization': ` ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: Number(expense.amount),
              category: expense.category,
              description: expense.description || ''
            })
          });
          
          if (!response.ok) {
            throw new Error('فشل في حفظ المصروف');
          }
        }
        savedExpenses = true;
      }
      
      // Show appropriate success message
      if (savedIncome && savedExpenses) {
        alert('تم حفظ الدخل والمصروفات بنجاح!');
      } else if (savedIncome) {
        alert('تم حفظ الدخل بنجاح!');
      } else if (savedExpenses) {
        alert('تم حفظ المصروفات بنجاح!');
      } else {
        alert('لا يوجد تغييرات جديدة لحفظها');
      }
      
      // Refresh data
      fetchFinancialData(userId);
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
            onChange={(e) => setIncome(e.target.value)}
            className="plane-budget-input"
          />
        </div>
        <div className="plane-budget-expenses-section">
          <div className="plane-budget-expenses-title">+ بنود الإنفاق</div>
          <div 
            className="plane-budget-expenses-list"
            style={{ 
              maxHeight: expenses.length > 3 ? '300px' : 'none',
              overflowY: expenses.length > 3 ? 'auto' : 'visible'
            }}
          >
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
              
              {/* Update Button */}
              {editingId === exp.id ? (
                <button
                  type="button"
                  className="plane-budget-update-btn"
                  onClick={() => handleUpdateExpense(exp.id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الحفظ...' : '💾'}
                </button>
              ) : (
                <button
                  type="button"
                  className="plane-budget-edit-btn"
                  onClick={() => setEditingId(exp.id)}
                  disabled={isLoading}
                >
                  ✏️
                </button>
              )}
              
              {/* Delete Button */}
              <button
                type="button"
                className="plane-budget-remove-btn"
                onClick={() => handleRemoveExpense(exp.id)}
                disabled={isLoading}
              >
                🗑️
              </button>
            </div>
          ))}
          </div>
          {/* {showOverspendingAlert && (
            <div className="plane-budget-warning">
              ⚠️ المصروفات اكتر من دخلك خلي بالك
            </div>
          )} */}
          <div className="plane-budget-add-expense-container">
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
          className={`plane-budget-save-btn ${!hasChanges ? 'disabled' : ''}`}
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
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