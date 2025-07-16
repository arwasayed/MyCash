const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskKey: { type: String, required: true }, 
  completed: { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('UserTask', userTaskSchema);
