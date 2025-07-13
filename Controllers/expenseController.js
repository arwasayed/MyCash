// controllers/expenseController.js

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { v4: uuidv4 } = require("uuid");
const { 
  getUserSummary, 
  getCurrentBalance,
  calculateNewBalance,
  getExpenseDetails,
  getIncomeDetails 
} = require("../services/financeService");

const { processFinancialDataForRAG } = require("./chatController");


async function addIncome(req, res) {
  try {
    console.log(`\n=== ADD INCOME REQUEST ===`);
    const { user_id, amount, currency = "EGP", frequency = "monthly", description } = req.body;
    console.log(`User: ${user_id}, Amount: ${amount}, Description: ${description}`);

    // Calculate the new balance BEFORE saving
    const balanceInfo = await calculateNewBalance(user_id, amount, true);
    
    console.log(`Calculated new balance: ${balanceInfo.new_balance}`);

    // Create income with calculated balance
    const income = await Income.create({
      id: uuidv4(),
      user_id,
      amount,
      currency,
      frequency,
      description,
      received_date: new Date(),
      balance_after: balanceInfo.new_balance,
      timestamp: new Date()
    });

    console.log(`Income saved with balance_after: ${income.balance_after}`);

    // Update RAG system
    await processFinancialDataForRAG(user_id);

    console.log(`=== END ADD INCOME REQUEST ===\n`);

    res.status(201).json({
      ...income.toObject(),
      message: `تم إضافة دخل بقيمة ${amount} ${currency}. رصيدك الحالي: ${income.balance_after} ${currency}`
    });
  } catch (err) {
    console.error("Error adding income:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function addExpense(req, res) {
  try {
    console.log(`\n=== ADD EXPENSE REQUEST ===`);
    const { user_id, amount, category, description, date = new Date() } = req.body;
    console.log(`User: ${user_id}, Amount: ${amount}, Description: ${description}`);

    // Calculate the new balance BEFORE saving
    const balanceInfo = await calculateNewBalance(user_id, amount, false);
    
    console.log(`Current balance: ${balanceInfo.current_balance}`);
    console.log(`Calculated new balance: ${balanceInfo.new_balance}`);
    
    // Check if user has sufficient balance
    if (balanceInfo.current_balance < amount) {
      console.log(`Insufficient balance: ${balanceInfo.current_balance} < ${amount}`);
      return res.status(400).json({ 
        error: `رصيدك الحالي ${balanceInfo.current_balance} ${balanceInfo.currency} غير كافي لهذا المصروف`,
        current_balance: balanceInfo.current_balance,
        requested_amount: amount,
        currency: balanceInfo.currency
      });
    }

    // Create expense with calculated balance
    const expense = await Expense.create({
      id: uuidv4(),
      user_id,
      amount,
      category,
      description,
      date,
      balance_after: balanceInfo.new_balance,
      timestamp: new Date()
    });

    console.log(`Expense saved with balance_after: ${expense.balance_after}`);

    // Update RAG system
    await processFinancialDataForRAG(user_id);

    console.log(`=== END ADD EXPENSE REQUEST ===\n`);

    res.status(201).json({
      ...expense.toObject(),
      message: `تم تسجيل مصروف بقيمة ${amount} ${balanceInfo.currency} على ${description || category}. رصيدك الحالي: ${expense.balance_after} ${balanceInfo.currency}`
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
  const { user_id, category, start_date, end_date, limit = 20 } = req.query;

  try {
    let query = { user_id };
    
    if (category) {
      query.category = category;
    }
    
    if (start_date && end_date) {
      query.date = {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      };
    }

    const expenses = await Expense.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    // Format expenses with additional details
    const formattedExpenses = expenses.map(expense => ({
      ...expense,
      formatted_date: new Date(expense.date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formatted_time: new Date(expense.date).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    res.json({ 
      expenses: formattedExpenses,
      total_count: formattedExpenses.length,
      total_amount: formattedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    });
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteExpense(req, res) {
  const { id } = req.params;
  try {
    const expense = await Expense.findOne({ id });
    
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Note: Deleting an expense would require recalculating all subsequent balances
    // For simplicity, we'll mark it as deleted but keep the record
    await Expense.findOneAndUpdate({ id }, { 
      deleted: true, 
      deleted_at: new Date() 
    });

    // Update RAG with new financial data
    await processFinancialDataForRAG(expense.user_id);

    res.json({ 
      success: true,
      message: "تم حذف المصروف بنجاح. ملاحظة: قد يؤثر هذا على الرصيد المحسوب."
    });
  } catch (err) {
    console.error("Error deleting expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateExpense(req, res) {
  const { id } = req.params;
  const updates = req.body;
  try {
    const expense = await Expense.findOne({ id });
    
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Note: Updating an expense would require recalculating all subsequent balances
    // For simplicity, we'll update the record but note the balance impact
    const updated = await Expense.findOneAndUpdate({ id }, {
      ...updates,
      updated_at: new Date()
    }, { new: true });

    // Update RAG with new financial data
    await processFinancialDataForRAG(expense.user_id);

    res.json({
      ...updated.toObject(),
      message: "تم تحديث المصروف بنجاح. ملاحظة: قد يؤثر هذا على الرصيد المحسوب."
    });
  } catch (err) {
    console.error("Error updating expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}


async function getSummary(req, res) {
  const { user_id } = req.query;
  try {
    const summary = await getUserSummary(user_id);
    const currentBalance = await getCurrentBalance(user_id);
    
    res.json({
      ...summary,
      current_balance: currentBalance.current_balance,
      currency: currentBalance.currency,
      last_transaction_date: currentBalance.last_transaction_date,
      summary_generated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error getting summary:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getBalance(req, res) {
  const { user_id } = req.query;
  try {
    const balance = await getCurrentBalance(user_id);
    
    res.json({
      user_id,
      current_balance: balance.current_balance,
      currency: balance.currency,
      last_transaction_date: balance.last_transaction_date,
      balance_checked_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error getting balance:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// Get detailed financial report
async function getFinancialReport(req, res) {
  const { user_id } = req.query;
  try {
    const summary = await getUserSummary(user_id);
    const expenseDetails = await getExpenseDetails(user_id, 20);
    const incomeDetails = await getIncomeDetails(user_id, 20);
    
    res.json({
      user_id,
      summary,
      detailed_expenses: expenseDetails,
      detailed_incomes: incomeDetails,
      report_generated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error generating financial report:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  addIncome,
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getSummary,
  getBalance,
  getFinancialReport
};