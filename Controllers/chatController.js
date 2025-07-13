// controllers/chatController.js

const { v4: uuidv4 } = require("uuid");
const Expense = require("../models/Expense");
const ChatMessage = require("../models/ChatMessage");
const { getFinancialAdvice } = require("../utils/openaiService");
const { RAGService } = require("../utils/ragService");
const User = require("../models/userModel");

const { 
  getUserSummary, 
  getCurrentBalance, 
  generateExpenseReport,
  getExpenseDetails,
  getIncomeDetails 
} = require("../services/financeService");

let ragService = null;

async function initializeRAG() {
  if (!ragService) {
    ragService = new RAGService();
    await ragService.initializeIndex();
    // console.log('RAG Service initialized');
  }
}

async function sendMessage(req, res) {
  try {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: "Missing user_id or message" });
    }

    // Step 1: Check free prompt limit
    const chatHistory = await ChatMessage.find({ user_id }).sort({ timestamp: -1 });
    const promptCount = chatHistory.filter(msg => msg.sender === "user").length;

    // 2. Fetch user subscription data
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // 3. Dynamic prompt limit calculation
      let maxPrompts = 4; // Default for Free users
      if (user.subscription && (user.subscription.type === 'Annual' || user.subscription.type === 'Monthly')) {
        maxPrompts = Infinity; 
      }

      // 4. Enhanced limit checking
      if (promptCount >= maxPrompts) {
        return res.json({
          message: "شكراً لاستخدامك النسخة المجانية! من فضلك اشترك لتستمتع بالمزيد من الخدمات.",
          requires_subscription: true
        });
      }

    // Step 2: Save user message to MongoDB
    const userMessageId = uuidv4();
    const userMessageObj = {
      id: userMessageId,
      user_id,
      sender: "user",
      message,
      timestamp: new Date()
    };

    await ChatMessage.create(userMessageObj);
    await storeMessageInRAG(userMessageObj);

    // Step 3: Get user financial summary
    const summary = await getUserSummary(user_id);
    const currentBalance = await getCurrentBalance(user_id);

    // Step 4: Retrieve relevant context from Pinecone
    const contextSummary = await getRelevantContext(user_id, message);

    // Step 5: Build contextual prompt
    let prompt = `
You are Mycash, an Egyptian financial advisor bot.
Speak in colloquial Egyptian Arabic. Keep replies short and cheerful.

User said: "${message}"
`;

  if (summary && summary.has_transactions) {
    prompt += `
  Current Balance: ${currentBalance.current_balance} ${currentBalance.currency}
  Total Income Received: ${summary.total_income_received} ${currentBalance.currency}
  Total Expenses Made: ${summary.total_expenses_made} ${currentBalance.currency}

  Recent Expenses:
  `;
    
    // Add recent expenses with dates
    summary.recent_expenses.slice(0, 5).forEach(expense => {
      prompt += `• ${expense.formatted_date}: ${expense.amount} ${currentBalance.currency} على ${expense.description || expense.category}\n`;
    });

    if (summary.recent_incomes.length > 0) {
      prompt += `\nRecent Income:
  `;
      summary.recent_incomes.slice(0, 3).forEach(income => {
        prompt += `• ${income.formatted_date}: ${income.amount} ${currentBalance.currency} - ${income.description || 'دخل'}\n`;
      });
    }

    prompt += `\nExpenses by Category:
  `;
    Object.entries(summary.expenses_by_category || {}).forEach(([cat, amt]) => {
      prompt += `• ${cat}: ${amt} ${currentBalance.currency}\n`;
    });
  }

  const isAskingAboutExpenses = /مصروف|صرف|انفق|فلوس|رصيد|باقي|expenses|balance|spent/i.test(message);
    
    if (isAskingAboutExpenses && summary.has_transactions) {
      const expenseReport = await generateExpenseReport(user_id);
      prompt += `\nDetailed Expense Report:
      ${expenseReport}
      `;
    }

    if (contextSummary && contextSummary.trim()) {
      prompt += `
Recent conversation:
${contextSummary}
`;
    }

    prompt += `
Based on the above financial data, give practical advice that:
1. Addresses their question directly
2. Uses the current balance and transaction history when relevant
3. References specific expenses with dates if they ask about spending
4. Mentions the exact current balance if they ask about money
5. References past conversations if available

Keep it friendly, concise, and use Egyptian Arabic!

`;

    // Step 6: Ask GPT for advice
    const botReply = await getFinancialAdvice(prompt);

    // Step 7: Save bot reply to MongoDB
    const botMessageId = uuidv4();
    const botMessageObj = {
      id: botMessageId,
      user_id,
      sender: "bot",
      message: botReply,
      timestamp: new Date()
    };

    await ChatMessage.create(botMessageObj);
    await storeMessageInRAG(botMessageObj);

    // Step 8: Return response
    res.json({
      reply: botReply,
      user_id,
      message_id: botMessageId,
      financial_summary: {
        current_balance: currentBalance.current_balance,
        currency: currentBalance.currency,
        total_income: summary.total_income_received || 0,
        total_expenses: summary.total_expenses_made || 0,
        recent_expenses_count: summary.recent_expenses?.length || 0,
        recent_incomes_count: summary.recent_incomes?.length || 0
      },
      debug_info: {
        rag_used: !!contextSummary,
        // finance_summary_available: !!summary.income
        finance_summary_available: !!summary.has_transactions,
        expense_report_generated: isAskingAboutExpenses
      }
    });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getRelevantContext(user_id, currentMessage) {
  try {
    if (ragService) {
      const relevantContext = await ragService.getRelevantContext(currentMessage, user_id);
      if (relevantContext && relevantContext.trim()) {
        return relevantContext;
      }
    }

    const history = await ChatMessage.find({ user_id })
      .sort({ timestamp: -1 })
      .limit(3);

    return history.reverse().map(msg => `${msg.sender}: ${msg.message}`).join("\n");
  } catch (err) {
    console.warn("Failed to retrieve context:", err.message);
    const history = await ChatMessage.find({ user_id }).limit(3);
    return history.map(msg => `${msg.sender}: ${msg.message}`).join("\n");
  }
}

async function storeMessageInRAG(messageObj) {
  try {
    if (ragService) {
      await ragService.storeMessageInVectorDB(messageObj);
    }
  } catch (err) {
    console.warn("Failed to store message in vector DB:", err.message);
  }
}

async function processFinancialDataForRAG(user_id) {
  try {
    if (ragService) {
      const summary = await getUserSummary(user_id);
      const currentBalance = await getCurrentBalance(user_id);
      
      if (summary.has_transactions) {
        // Create a comprehensive financial summary for RAG
        let financialSummary = `User financial status: Current balance ${currentBalance.current_balance} ${currentBalance.currency}. `;
        financialSummary += `Total income received: ${summary.total_income_received} ${currentBalance.currency}. `;
        financialSummary += `Total expenses: ${summary.total_expenses_made} ${currentBalance.currency}. `;
        
        // Add recent transactions
        if (summary.recent_expenses.length > 0) {
          financialSummary += `Recent expenses: `;
          summary.recent_expenses.slice(0, 5).forEach(expense => {
            financialSummary += `${expense.amount} ${currentBalance.currency} on ${expense.description || expense.category} on ${expense.formatted_date}; `;
          });
        }
        
        if (summary.recent_incomes.length > 0) {
          financialSummary += `Recent income: `;
          summary.recent_incomes.slice(0, 3).forEach(income => {
            financialSummary += `${income.amount} ${currentBalance.currency} received on ${income.formatted_date}; `;
          });
        }
        
        const financialMessage = {
          id: `financial_${user_id}_${Date.now()}`,
          user_id,
          sender: "system",
          message: financialSummary,
          timestamp: new Date()
        };
        
        await ragService.storeMessageInVectorDB(financialMessage);
      }
    }
  } catch (err) {
    console.warn("Failed to store financial data in vector DB:", err.message);
  }
}


async function getChatHistory(req, res) {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id in query parameters" });
    }

    const history = await ChatMessage.find({ user_id })
      .sort({ timestamp: 1 }) // Oldest first
      .select("sender message timestamp"); // Only needed fields

    if (!history.length) {
      return res.json({
        user_id,
        history: [],
        message: "لا يوجد محادثات سابقة لهذا المستخدم"
      });
    }

    res.json({
      user_id,
      history: history.map(msg => ({
        sender: msg.sender,
        message: msg.message,
        timestamp: msg.timestamp.toISOString()
      }))
    });

  } catch (err) {
    console.error(" Error fetching chat history:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { 
  sendMessage, 
  getChatHistory, 
  initializeRAG,
  processFinancialDataForRAG
};
