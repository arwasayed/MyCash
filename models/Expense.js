// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", expenseSchema);