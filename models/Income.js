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
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Income", incomeSchema);