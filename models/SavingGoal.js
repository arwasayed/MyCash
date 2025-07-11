const mongoose = require('mongoose');

const SavingGoalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 100 
  },
  targetAmount: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  currentAmount: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  startDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'Start date cannot be in the future'
    }
  },
  deadline: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'Deadline must be after start date'
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'expired'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('SavingGoal', SavingGoalSchema);
