const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  balance_after: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },
  updated_at: { type: Date }
});


module.exports = mongoose.model("Expense", expenseSchema);

