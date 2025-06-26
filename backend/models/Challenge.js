const mongoose=require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    title: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 100 
    },
    description: { 
      type: String, 
      required: true, 
      minlength: 5 
    },
    durationDays: { 
      type: Number, 
      min: 1 
    },
    rewardXP: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Challenge', ChallengeSchema);
  