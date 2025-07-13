const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "EGP" },
  frequency: {
    type: String,
    enum: ["monthly", "annual"],
    default: "monthly"
  },
  description: { type: String },
  received_date: { type: Date, default: Date.now },
  balance_after: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

// NO PRE-SAVE HOOKS - Balance will be calculated in controller
module.exports = mongoose.model("Income", incomeSchema);

