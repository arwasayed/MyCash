const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['goal', 'challenge', 'badge', 'finance'],
    required: true
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
