const mongoose=require('mongoose');

const BadgeSchema = new mongoose.Schema({
    title: { 
      type: String, 
      required: true, 
      unique: true,
      minlength: 3 
    },
    description: { 
      type: String, 
      required: true 
    },
    icon: { 
      type: String
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Badge', BadgeSchema);
  