// models/ChatMessage.js
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User", required: true },
  sender: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  embedding_summary: { 
    type: String,
    default: function () {
      // Simulate embedding by summarizing message
      return this.message.split(" ").slice(0, 10).join(" ") + "...";
    }
  }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);