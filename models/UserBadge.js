const mongoose=require('mongoose');

const UserBadgeSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    badgeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Badge', 
      required: true 
    },
    unlockedAt: { 
      type: Date, 
      default: Date.now 
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('UserBadge', UserBadgeSchema);
  