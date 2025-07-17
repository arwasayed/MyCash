const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { createNotification } = require('../Controllers/notification');



async function getFilteredTransactions(user_id, filters = {}) {
  const { period, category, transactionType } = filters;
  
  // Base query
  let incomeQuery = { user_id };
  let expenseQuery = { user_id, deleted: { $ne: true } };

  // Date filtering based on period
  if (period) {
    const dateRange = getDateRange(period);
    if (dateRange) {
      incomeQuery.received_date = { $gte: dateRange.start, $lte: dateRange.end };
      expenseQuery.date = { $gte: dateRange.start, $lte: dateRange.end };
    }
  }

  // Category filtering
  if (category && category !== 'all') {
    if (category === 'income') {
      // Only show incomes
      expenseQuery = null;
    } else if (category === 'expenses') {
      // Only show expenses
      incomeQuery = null;
    } else {
      // Specific category (for expenses)
      expenseQuery.category = { $regex: new RegExp(category, 'i') };
    }
  }

  // Transaction type filtering
  if (transactionType && transactionType !== 'all') {
    const typeQuery = { transactionType };
    if (incomeQuery) incomeQuery.transactionType = transactionType;
    if (expenseQuery) expenseQuery.transactionType = transactionType;
  }

  // Execute queries
  const incomes = incomeQuery ? await Income.find(incomeQuery).sort({ timestamp: -1 }).lean() : [];
  const expenses = expenseQuery ? await Expense.find(expenseQuery).sort({ timestamp: -1 }).lean() : [];

  return { incomes, expenses };
}
function getDateRange(period) {
  const now = new Date();
  switch(period) {
    case 'this-month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      };
    case 'last-month':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0)
      };
    case 'this-year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31)
      };
    default:
      return null;
  }
}

async function generateFinancialReport(user_id, filters = {}) {
  const { incomes, expenses } = await getFilteredTransactions(user_id, filters);
  
  const summary = await getUserSummary(user_id);
  const expenseDetails = expenses.slice(0, 20).map(formatExpense);
  const incomeDetails = incomes.slice(0, 20).map(formatIncome);

  return {
    summary,
    detailed_expenses: expenseDetails,
    detailed_incomes: incomeDetails
  };
}

function formatExpense(expense) {
  return {
    ...expense,
    formatted_date: new Date(expense.date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
}

function formatIncome(income) {
  return {
    ...income,
    formatted_date: new Date(income.received_date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
}
async function getCurrentBalance(user_id) {
  try {
    console.log(`\n=== Getting Current Balance for User: ${user_id} ===`);
    
    // Get ALL transactions for this user and sort by timestamp
    const allIncomes = await Income.find({ user_id }).sort({ timestamp: -1 });
    const allExpenses = await Expense.find({ user_id }).sort({ timestamp: -1 });
    
    console.log(`Found ${allIncomes.length} incomes and ${allExpenses.length} expenses`);
    
    // Combine all transactions and sort by timestamp (most recent first)
    const allTransactions = [
      ...allIncomes.map(income => ({
        ...income.toObject(),
        type: 'income',
        transaction_timestamp: income.timestamp
      })),
      ...allExpenses.map(expense => ({
        ...expense.toObject(),
        type: 'expense',
        transaction_timestamp: expense.timestamp
      }))
    ].sort((a, b) => new Date(b.transaction_timestamp) - new Date(a.transaction_timestamp));
    
    console.log(`Total transactions: ${allTransactions.length}`);
    
    let currentBalance = 0;
    let lastTransactionDate = null;
    let currency = "EGP";
    
    if (allTransactions.length > 0) {
      // Get the most recent transaction
      const latestTransaction = allTransactions[0];
      currentBalance = latestTransaction.balance_after || 0;
      lastTransactionDate = latestTransaction.transaction_timestamp;
      currency = latestTransaction.currency || "EGP";
      
      console.log(`Latest transaction: ${latestTransaction.type} - Balance: ${currentBalance}`);
    } else {
      console.log(`No transactions found, balance is 0`);
    }
    
    console.log(`Final Current Balance: ${currentBalance} ${currency}`);
    console.log(`=== End Getting Current Balance ===\n`);
    
    return {
      current_balance: currentBalance,
      last_transaction_date: lastTransactionDate,
      currency: currency
    };
  } catch (error) {
    console.error("Error getting current balance:", error);
    return {
      current_balance: 0,
      last_transaction_date: null,
      currency: "EGP"
    };
  }
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

async function checkOverspending(user_id) {
  const summary = await getUserSummary(user_id);
  
  // حساب الدخل المتبقي بعد المصروفات
  const remaining_income = summary.total_income_received - summary.total_expenses_made;
  
  if (summary.total_income_received <= 0) return false;
  
  const remainingPercentage = (remaining_income / summary.total_income_received) * 100;
  
  if (remainingPercentage <= 20) {
    await createNotification(
      user_id,
      `⚠️ خلي بالك من فلوسك! كدة هنشحت آخر الشهر! (متبقي ${remaining_income} ${summary.currency} - ${Math.round(remainingPercentage)}%)`,
      'finance'
    );
    return true;
  }
  
  return false;
}


async function calculateNewBalance(user_id, amount, isIncome = true) {
  try {
    console.log(`\n=== Calculating New Balance ===`);
    console.log(`User: ${user_id}, Amount: ${amount}, Is Income: ${isIncome}`);
    
    const currentBalanceInfo = await getCurrentBalance(user_id);
    const currentBalance = currentBalanceInfo.current_balance;
    
    let newBalance;
    if (isIncome) {
      newBalance = currentBalance + amount;
    } else {
      newBalance = currentBalance - amount;
    }
    
    console.log(`Current Balance: ${currentBalance}`);
    console.log(`New Balance: ${newBalance}`);
    console.log(`=== End Calculating New Balance ===\n`);
    
    return {
      current_balance: currentBalance,
      new_balance: newBalance,
      currency: currentBalanceInfo.currency
    };
  } catch (error) {
    console.error("Error calculating new balance:", error);
    return {
      current_balance: 0,
      new_balance: isIncome ? amount : -amount,
      currency: "EGP"
    };
  }
}

async function getTransactionHistory(user_id, limit = 50) {
  try {
    // Get all incomes and expenses
    const incomes = await Income.find({ user_id }).lean();
    const expenses = await Expense.find({ user_id }).lean();
    
    // Combine and sort by timestamp
    const allTransactions = [
      ...incomes.map(income => ({
        ...income,
        type: 'income',
        formatted_date: income.received_date || income.timestamp
      })),
      ...expenses.map(expense => ({
        ...expense,
        type: 'expense',
        formatted_date: expense.date || expense.timestamp
      }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return allTransactions.slice(-limit); // Return most recent transactions
  } catch (error) {
    console.error("Error getting transaction history:", error);
    return [];
  }
}

async function getExpenseDetails(user_id, limit = 20) {
  try {
    const expenses = await Expense.find({ user_id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    
    return expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      balance_after: expense.balance_after,
      formatted_date: new Date(expense.date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  } catch (error) {
    console.error("Error getting expense details:", error);
    return [];
  }
}

async function getIncomeDetails(user_id, limit = 20) {
  try {
    const incomes = await Income.find({ user_id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    
    return incomes.map(income => ({
      id: income.id,
      amount: income.amount,
      description: income.description,
      received_date: income.received_date,
      balance_after: income.balance_after,
      formatted_date: new Date(income.received_date || income.timestamp).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  } catch (error) {
    console.error("Error getting income details:", error);
    return [];
  }
}

async function getUserSummary(user_id) {
  try {
    const currentBalance = await getCurrentBalance(user_id);
    const expenseDetails = await getExpenseDetails(user_id, 10);
    const incomeDetails = await getIncomeDetails(user_id, 10);
    const transactionHistory = await getTransactionHistory(user_id, 20);
    
    // Calculate totals
    const totalIncome = await Income.aggregate([
      { $match: { user_id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const totalExpenses = await Expense.aggregate([
      { $match: { user_id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Calculate expenses by category
    const expensesByCategory = await Expense.aggregate([
      { $match: { user_id } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]);
   
    const categorySummary = {};
    expensesByCategory.forEach(cat => {
      categorySummary[cat._id] = cat.total;
    });
    
    return {
      current_balance: currentBalance.current_balance,
      currency: currentBalance.currency,
      last_transaction_date: currentBalance.last_transaction_date,
      total_income_received: totalIncome[0]?.total || 0,
      total_expenses_made: totalExpenses[0]?.total || 0,
      expenses_by_category: categorySummary,
      recent_expenses: expenseDetails,
      recent_incomes: incomeDetails,
      transaction_history: transactionHistory,
      has_transactions: transactionHistory.length > 0
    };
  } catch (error) {
    console.error("Error getting user summary:", error);
    return {
      current_balance: 0,
      currency: "EGP",
      total_income_received: 0,
      total_expenses_made: 0,
      expenses_by_category: {},
      recent_expenses: [],
      recent_incomes: [],
      transaction_history: [],
      has_transactions: false,
      message: "حدث خطأ في استرجاع البيانات المالية."
    };
  }
}

async function generateExpenseReport(user_id) {
  try {
    const expenses = await getExpenseDetails(user_id, 20);
    const currentBalance = await getCurrentBalance(user_id);
    
    if (expenses.length === 0) {
      return "لم تقم بإدخال أي مصروفات حتى الآن.";
    }
    
    let report = `إليك تفاصيل مصروفاتك:\n\n`;
    
    expenses.forEach((expense, index) => {
      report += `${index + 1}. في يوم ${expense.formatted_date} أنفقت ${expense.amount} جنيه على ${expense.description || expense.category}`;
      if (expense.balance_after !== undefined) {
        report += ` وأصبح رصيدك ${expense.balance_after} جنيه`;
      }
      report += `\n`;
    });
    
    report += `\nرصيدك الحالي هو ${currentBalance.current_balance} جنيه.`;
    
    return report;
  } catch (error) {
    console.error("Error generating expense report:", error);
    return "حدث خطأ في إنشاء تقرير المصروفات.";
  }
}



module.exports = { 
  getUserSummary, 
  filterExpenses,
  getCurrentBalance,
  calculateNewBalance,
  getTransactionHistory,
  getExpenseDetails,
  getIncomeDetails,
  generateExpenseReport,
  checkOverspending,
  getFilteredTransactions,
  generateFinancialReport,
  formatExpense,
  formatIncome
};
