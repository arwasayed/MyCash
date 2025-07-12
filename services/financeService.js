// services/financeService.js
const Income = require("../models/Income");
const Expense = require("../models/Expense");
async function getUserSummary(user_id) {
    const income = await Income.findOne({ user_id }).sort({ timestamp: -1 });
    const expenses = await Expense.find({ user_id });
  
    if (!income) {
      return {
        message: "لم يتم إدخال دخل حتى الآن."
      };
    }
  
    const totalIncome = income.frequency === "monthly"
      ? income.amount
      : income.amount / 12; // Convert annual to monthly
  
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
    const categories = {};
    expenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
  
    const remaining = totalIncome - totalExpenses;
  
    return {
      income: totalIncome,
      currency: income.currency,
      total_expenses: totalExpenses,
      expenses_by_category: categories,
      remaining_income: remaining >= 0 ? remaining : 0
    };
  }
  
  function filterExpenses(expenses, category, startDate, endDate) {
    let filtered = [...expenses];
  
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }
  
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      });
    }
  
    return filtered;
  }
  
  module.exports = { getUserSummary, filterExpenses };