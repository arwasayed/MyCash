// controllers/chatController.js

const { v4: uuidv4 } = require("uuid");
const Expense = require("../models/Expense");
const ChatMessage = require("../models/ChatMessage");
const { getFinancialAdvice } = require("../utils/openaiService");
const { RAGService } = require("../utils/ragService");
const { getUserSummary } = require("../services/financeService");

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

    if (promptCount >= 4) {
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

    // Step 4: Retrieve relevant context from Pinecone
    const contextSummary = await getRelevantContext(user_id, message);

    // Step 5: Build contextual prompt
    let prompt = `
You are Mycash, an Egyptian financial advisor bot.
Speak in colloquial Egyptian Arabic. Keep replies short and cheerful.

User said: "${message}"
`;

    if (summary && summary.income) {
      prompt += `
Monthly income: ${summary.income} ${summary.currency}
Total spent this month: ${summary.total_expenses} ${summary.currency}
Remaining: ${summary.remaining_income} ${summary.currency}
Expenses by category:
`;
      Object.entries(summary.expenses_by_category || {}).forEach(([cat, amt]) => {
        prompt += `• ${cat}: ${amt} ${summary.currency}\n`;
      });
    }

    if (contextSummary && contextSummary.trim()) {
      prompt += `
Recent conversation:
${contextSummary}
`;
    }

    prompt += `
Based on the above, give practical advice that:
1. Addresses their question directly
2. Uses financial summary when relevant
3. References past conversations if available
Keep it friendly and concise!
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
      debug_info: {
        rag_used: !!contextSummary,
        finance_summary_available: !!summary.income
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

async function processExpenseDataForRAG(user_id, expenses) {
  try {
    if (ragService && expenses.length > 0) {
      const expenseSummary = `User expense data: Total spent ${expenses.reduce((sum, e) => sum + e.amount, 0)} EGP. Categories: ${expenses.map(e => `${e.category} (${e.amount} EGP on ${e.date})`).join(", ")}`;
      const expenseMessage = {
        id: `expense_${user_id}_${Date.now()}`,
        user_id,
        sender: "system",
        message: expenseSummary,
        timestamp: new Date()
      };
      await ragService.storeMessageInVectorDB(expenseMessage);
    }
  } catch (err) {
    console.warn("Failed to store expense data in vector DB:", err.message);
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

module.exports = { sendMessage, getChatHistory, initializeRAG };