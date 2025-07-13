// controllers/expenseController.js

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { v4: uuidv4 } = require("uuid");
const { getUserSummary, checkOverspending } = require("../services/financeService");

async function addIncome(req, res) {
  try {
    const { user_id, amount, currency = "EGP", frequency = "monthly", description } = req.body;

    const income = await Income.create({
      id: uuidv4(),
      user_id,
      amount,
      currency,
      frequency,
      description
    });

    res.status(201).json(income);
  } catch (err) {
    console.error("Error adding income:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function addExpense(req, res) {
  try {
    const { user_id, amount, category, description, date = new Date() } = req.body;

    const expense = await Expense.create({
      id: uuidv4(),
      user_id,
      amount,
      category,
      description,
      date
    });

    // التحقق من الإنفاق الزائد بعد إضافة المصروف
    await checkOverspending(user_id);

    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getExpenses(req, res) {
  const { user_id, category, start_date, end_date } = req.query;

  try {
    let expenses = await Expense.find({ user_id });

    if (category || start_date || end_date) {
      const { filterExpenses } = require("../services/financeService");
      expenses = filterExpenses(expenses, category, start_date, end_date);
    }

    res.json({ expenses });
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteExpense(req, res) {
  const { id } = req.params;
  try {
    await Expense.deleteOne({ id });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateExpense(req, res) {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updated = await Expense.findOneAndUpdate({ id }, updates, { new: true });

    // التحقق من الإنفاق الزائد بعد تعديل المصروف
    if (updates.amount) {
      await checkOverspending(updated.user_id);
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getSummary(req, res) {
  const { user_id } = req.query;
  try {
    const summary = await getUserSummary(user_id);
    res.json(summary);
  } catch (err) {
    console.error("Error getting summary:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  addIncome,
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getSummary
};
