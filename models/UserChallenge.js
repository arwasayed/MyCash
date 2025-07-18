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
      enum: ['not_started', 'in_progress', 'completed', 'failed'], 
      default: 'not_started' 
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('UserChallenge', UserChallengeSchema);
  