// services/scheduler.js
const { checkOverspending } = require('./financeService');
const User = require('../models/userModel');

async function dailyFinanceCheck() {
  try {
    const users = await User.find({});
    
    for (const user of users) {
      await checkOverspending(user._id);
    }
  } catch (err) {
    console.error('Error in daily finance check:', err);
  }
}

module.exports = { dailyFinanceCheck };
