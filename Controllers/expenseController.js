// controllers/expenseController.js

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { v4: uuidv4 } = require("uuid");
const { 
  getUserSummary, 
  getCurrentBalance,
  calculateNewBalance,
  getExpenseDetails,
  getIncomeDetails,
  checkOverspending ,
  generateFinancialReport,
  formatExpense,
  formatIncome
} = require("../services/financeService");
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const { processFinancialDataForRAG } = require("./chatController");

async function getFinancialReport(req, res) {
  try {
    const { user_id, period, category, transactionType } = req.query;
    
    const reportData = await generateFinancialReport(user_id, {
      period,
      category,
      transactionType
    });

    res.json({
      user_id,
      ...reportData,
      report_generated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error generating financial report:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function generatePDFReport(req, res) {
  try {
    const { user_id, period, category, transactionType } = req.query;
    
    const data = await generateFinancialReport(user_id, {
      period,
      category,
      transactionType
    });

    // Create PDF
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=financial-report-${user_id}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add Arabic title
    doc.fontSize(20).text('التقرير المالي', { align: 'right' });
    doc.moveDown();
    
    // Add summary
    doc.fontSize(14).text(`الرصيد الحالي: ${data.summary.current_balance} ${data.summary.currency}`, { align: 'right' });
    doc.text(`إجمالي الدخل: ${data.summary.total_income_received} ${data.summary.currency}`, { align: 'right' });
    doc.text(`إجمالي المصروفات: ${data.summary.total_expenses_made} ${data.summary.currency}`, { align: 'right' });
    doc.moveDown();
    
    // Add expenses by category
    doc.fontSize(16).text('المصروفات حسب التصنيف', { align: 'right' });
    Object.entries(data.summary.expenses_by_category).forEach(([category, amount]) => {
      doc.text(`${category}: ${amount} ${data.summary.currency}`, { align: 'right' });
    });
    doc.moveDown();
    
    // Add recent transactions
    doc.fontSize(16).text('آخر المعاملات', { align: 'right' });
    data.detailed_expenses.forEach(expense => {
      doc.text(`مصروف: ${expense.amount} ${data.summary.currency} - ${expense.category} - ${expense.formatted_date}`, { align: 'right' });
    });
    data.detailed_incomes.forEach(income => {
      doc.text(`دخل: ${income.amount} ${data.summary.currency} - ${income.description} - ${income.formatted_date}`, { align: 'right' });
    });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF report" });
  }
}

async function generateExcelReport(req, res) {
  try {
    const { user_id, period, category, transactionType } = req.query;
    
    const data = await generateFinancialReport(user_id, {
      period,
      category,
      transactionType
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('التقرير المالي');
    
    // Set RTL direction
    worksheet.views = [{ rightToLeft: true }];
    
    // Add summary
    worksheet.addRow(['الرصيد الحالي', data.summary.current_balance]);
    worksheet.addRow(['إجمالي الدخل', data.summary.total_income_received]);
    worksheet.addRow(['إجمالي المصروفات', data.summary.total_expenses_made]);
    worksheet.addRow([]);
    
    // Add expenses by category
    worksheet.addRow(['التصنيف', 'المبلغ']);
    Object.entries(data.summary.expenses_by_category).forEach(([category, amount]) => {
      worksheet.addRow([category, amount]);
    });
    worksheet.addRow([]);
    
    // Add recent transactions
    worksheet.addRow(['نوع المعاملة', 'المبلغ', 'التصنيف/الوصف', 'التاريخ']);
    data.detailed_expenses.forEach(expense => {
      worksheet.addRow(['مصروف', expense.amount, expense.category, expense.formatted_date]);
    });
    data.detailed_incomes.forEach(income => {
      worksheet.addRow(['دخل', income.amount, income.description, income.formatted_date]);
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=financial-report-${user_id}.xlsx`);
    
    // Send Excel file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ error: "Error generating Excel report" });
  }
}
// Helper function to recalculate all balances after modification
async function recalculateAllBalances(user_id) {
  try {
    console.log(`\n=== RECALCULATING ALL BALANCES FOR USER: ${user_id} ===`);
    
    // Get ALL transactions for this user and sort by timestamp
    const allIncomes = await Income.find({ user_id }).sort({ timestamp: 1 });
    const allExpenses = await Expense.find({ user_id, deleted: { $ne: true } }).sort({ timestamp: 1 });
    
    // Combine all transactions and sort by timestamp (oldest first)
    const allTransactions = [
      ...allIncomes.map(income => ({
        ...income.toObject(),
        type: 'income',
        model: Income
      })),
      ...allExpenses.map(expense => ({
        ...expense.toObject(),
        type: 'expense',
        model: Expense
      }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    console.log(`Found ${allTransactions.length} total transactions to recalculate`);
    
    let runningBalance = 0;
    
    // Recalculate balance for each transaction in chronological order
    for (let i = 0; i < allTransactions.length; i++) {
      const transaction = allTransactions[i];
      
      if (transaction.type === 'income') {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;
      }
      
      // Update the balance_after field in the database
      await transaction.model.findOneAndUpdate(
        { id: transaction.id },
        { balance_after: runningBalance },
        { new: true }
      );
      
      console.log(`Updated ${transaction.type} ${transaction.id}: balance_after = ${runningBalance}`);
    }
    
    console.log(`=== FINISHED RECALCULATING ALL BALANCES ===\n`);
    return runningBalance;
    
  } catch (error) {
    console.error("Error recalculating balances:", error);
    throw error;
  }
}

async function addIncome(req, res) {
  try {
    const user_id = req.user._id.toString();
    console.log(`\n=== ADD INCOME REQUEST ===`);
    const { id, amount, currency = "EGP", frequency = "monthly", description } = req.body;
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
    const user_id = req.user._id.toString();
    console.log(`\n=== ADD EXPENSE REQUEST ===`);
    const { id, amount, category, description, date = new Date() } = req.body;
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

    // Check for overspending after adding expense
    await checkOverspending(user_id);

    console.log(`=== END ADD EXPENSE REQUEST ===\n`);

    res.status(201).json({
      ...expense.toObject(),
      message: `تم تسجيل مصروف بقيمة ${amount} ${balanceInfo.currency} على ${description || category}. رصيدك الحالي: ${expense.balance_after} ${balanceInfo.currency}`
    });
  } catch (err) {
    console.error("Error adding expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getExpenses(req, res) {
  const user_id = req.user._id.toString() ;
  const { id, category, start_date, end_date, limit = 20 } = req.query;

  try {
    console.log(`\n=== GET EXPENSES REQUEST ===`);
    console.log(`User: ${user_id}, Category: ${category}, Limit: ${limit}`);
    
    let query = { user_id, deleted: { $ne: true } };
    
    // FIXED: Arabic category search with case-insensitive regex
    if (category) {
      // Use regex for partial matching and case-insensitive search
      query.category = { $regex: new RegExp(category, 'i') };
      console.log(`Searching for category: ${category} (case-insensitive)`);
    }
    
    if (start_date && end_date) {
      query.date = {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      };
      console.log(`Date range: ${start_date} to ${end_date}`);
    }

    console.log(`Final query:`, JSON.stringify(query, null, 2));

    const expenses = await Expense.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`Found ${expenses.length} expenses`);

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

    console.log(`=== END GET EXPENSES REQUEST ===\n`);

    res.json({ 
      expenses: formattedExpenses,
      total_count: formattedExpenses.length,
      total_amount: formattedExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      search_criteria: {
        user_id,
        category: category || 'all',
        date_range: start_date && end_date ? `${start_date} to ${end_date}` : 'all'
      }
    });
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteExpense(req, res) {
  const { id } = req.params;
  try {
    console.log(`\n=== DELETE EXPENSE REQUEST ===`);
    console.log(`Expense ID: ${id}`);
    
    const expense = await Expense.findOne({ id });
    
    if (!expense) {
      console.log(`Expense not found: ${id}`);
      return res.status(404).json({ error: "Expense not found" });
    }

    console.log(`Found expense: ${expense.amount} ${expense.category} for user ${expense.user_id}`);

    // FIXED: Actually delete the expense from database
    await Expense.findOneAndDelete({ id });
    console.log(`Expense deleted from database`);

    // FIXED: Recalculate all balances after deletion
    const newBalance = await recalculateAllBalances(expense.user_id);
    console.log(`New balance after recalculation: ${newBalance}`);

    // Update RAG with new financial data
    await processFinancialDataForRAG(expense.user_id);

    console.log(`=== END DELETE EXPENSE REQUEST ===\n`);

    res.json({ 
      success: true,
      message: `تم حذف المصروف بنجاح. رصيدك الحالي: ${newBalance} جنيه`,
      deleted_expense: {
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description
      },
      new_balance: newBalance
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
    console.log(`\n=== UPDATE EXPENSE REQUEST ===`);
    console.log(`Expense ID: ${id}`);
    console.log(`Updates:`, JSON.stringify(updates, null, 2));
    
    const expense = await Expense.findOne({ id });
    
    if (!expense) {
      console.log(`Expense not found: ${id}`);
      return res.status(404).json({ error: "Expense not found" });
    }

    console.log(`Found expense: ${expense.amount} ${expense.category} for user ${expense.user_id}`);

    // FIXED: Validate new amount if being updated
    if (updates.amount && updates.amount !== expense.amount) {
      console.log(`Amount changing from ${expense.amount} to ${updates.amount}`);
      
      // Calculate what the balance would be if we remove the old expense and add the new one
      const currentBalance = await getCurrentBalance(expense.user_id);
      const balanceWithoutOldExpense = currentBalance.current_balance + expense.amount;
      const balanceWithNewExpense = balanceWithoutOldExpense - updates.amount;
      
      console.log(`Current balance: ${currentBalance.current_balance}`);
      console.log(`Balance without old expense: ${balanceWithoutOldExpense}`);
      console.log(`Balance with new expense: ${balanceWithNewExpense}`);
      
      if (balanceWithNewExpense < 0) {
        console.log(`Insufficient balance for update`);
        return res.status(400).json({ 
          error: `لا يمكن تحديث المصروف. الرصيد المتاح ${balanceWithoutOldExpense} جنيه غير كافي للمبلغ الجديد ${updates.amount} جنيه`,
          current_balance: currentBalance.current_balance,
          available_after_removal: balanceWithoutOldExpense,
          requested_amount: updates.amount
        });
      }
    }

    // FIXED: Update the expense in database
    const updated = await Expense.findOneAndUpdate(
      { id }, 
      {
        ...updates,
        updated_at: new Date()
      }, 
      { new: true }
    );

    console.log(`Expense updated in database`);

    // FIXED: Recalculate all balances after update
    const newBalance = await recalculateAllBalances(expense.user_id);
    console.log(`New balance after recalculation: ${newBalance}`);

    // Update RAG with new financial data
    await processFinancialDataForRAG(expense.user_id);

    // Check for overspending if amount was updated
    if (updates.amount) {
      await checkOverspending(expense.user_id);
    }

    console.log(`=== END UPDATE EXPENSE REQUEST ===\n`);

    res.json({
      ...updated.toObject(),
      message: `تم تحديث المصروف بنجاح. رصيدك الحالي: ${newBalance} جنيه`,
      old_amount: expense.amount,
      new_amount: updated.amount,
      new_balance: newBalance
    });
  } catch (err) {
    console.error("Error updating expense:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getSummary(req, res) {
  const user_id = req.user._id.toString();
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
  const user_id = req.user._id.toString() ;
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

// async function getFinancialReport(req, res) {
//   const { user_id , } = req.query;
//   try {
//     const summary = await getUserSummary(user_id);
//     const expenseDetails = await getExpenseDetails(user_id, 20);
//     const incomeDetails = await getIncomeDetails(user_id, 20);
    
//     res.json({
//       user_id,
//       summary,
//       detailed_expenses: expenseDetails,
//       detailed_incomes: incomeDetails,
//       report_generated_at: new Date().toISOString()
//     });
//   } catch (err) {
//     console.error("Error generating financial report:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// }

module.exports = {
  addIncome,
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getSummary,
  getBalance,
  getFinancialReport,
  generatePDFReport,
  generateExcelReport
};
