const mongoose=require('mongoose');

const UserChallengeSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    challengeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Challenge', 
      required: true 
    },
    startedAt: { 
      type: Date, 
      default: Date.now 
    },
    completedAt: { 
      type: Date 
    },
    status: { 
      type: String, 
      enum: ['in_progress', 'completed', 'failed'], 
      default: 'in_progress' 
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('UserChallenge', UserChallengeSchema);
  