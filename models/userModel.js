const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: {
      value: true,
      message: 'This email is already registered'
    },
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(v)) {
          return false;
        }
        const allowedDomains = [
          'gmail.com',
          'yahoo.com',
          'outlook.com',
          'hotmail.com',
          'icloud.com',
          'protonmail.com',
          'company.com'
        ];
        const domain = v.split('@')[1].toLowerCase();
        return allowedDomains.includes(domain);
      },
      message: 'Please use a valid email from supported domains (Gmail, Yahoo, Outlook, etc)'
    },
    set: function(v) {
      return v.trim().toLowerCase();
    }
  },
  
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
  type: String,
  unique: {
    value: true,
    message: 'Phone number is already registered'
  },
  sparse: true,
  required: false, 
  validate: {
    validator: function(v) {
      if (!v) return true; 
      const cleaned = v.replace(/^\+20|^0020|[\s-]/g, '');
      return /^01[0125]\d{8}$/.test(cleaned);
    },
    message: 'Invalid Egyptian phone number. Must be 11 digits starting with 010, 011, 012, or 015'
  },
  set: function(v) {
    return v ? v.replace(/^\+20|^0020|[\s-]/g, '') : v;
  }

  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
    validate: {
      validator: function(v) {
        if (this.provider === 'google') return true;
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
      },
      message: 'Password must contain at least: 1 uppercase, 1 lowercase, 1 number'
    }
  },
  nickname: { 
    type: String,
    default: 'User',
    minlength: [2, 'Nickname must be at least 2 characters'],
    maxlength: [30, 'Nickname cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_\- ]+$/, 'Nickname can only contain letters, numbers, spaces, hyphens and underscores']
  },
avatar: {
  type: String,
  default: 'default-avatar.png', // صورة افتراضية
  validate: {
    validator: function(v) {
      return /\.(jpg|jpeg|png|gif|webp)$|^https?:\/\//i.test(v);
    },
    message: 'يجب أن تكون الصورة بصيغة صالحة (JPG, PNG, GIF) أو رابط URL'
  }

    
  },
  language: {
    type: String,
    default: 'ar',
    enum: {
      values: ['ar', 'en'],
      message: 'Language must be either Arabic (ar) or English (en)'
    }
  },
  lastLogin: {
    type: Date,
    validate: {
      validator: function(v) {
        return v ? v <= Date.now() : true;
      },
      message: 'Last login date cannot be in the future'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: function() {
      return this.provider === 'google';
    }
  },
  emailVerifyToken: String,
  emailVerifyExpire: Date
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      delete ret.emailVerifyToken;
      delete ret.emailVerifyExpire;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingUser = await this.constructor.findOne({ email: this.email });
    if (existingUser && !existingUser._id.equals(this._id)) {
      throw new Error('Email is already registered');
    }
  }
  
  if (this.isModified('phone') && this.phone) {
    const existingUser = await this.constructor.findOne({ phone: this.phone });
    if (existingUser && !existingUser._id.equals(this._id)) {
      throw new Error('Phone number is already registered');
    }
  }
  next();
});


userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.provider !== 'local') {
    throw new Error('Compare password is only available for local users');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  if (this.provider !== 'local') {
    throw new Error('Password reset is only available for local users');
  }
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerifyToken = function() {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  this.emailVerifyToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
  return verifyToken;
};

userSchema.add({
  subscription: {
    type: {
      type: String,
      default: 'Free'
    },
    status: {
      type: String, 
      default: 'inactive'
    },
    startDate: Date,
    endDate: Date,
    paymentMethod: String
  }
});


userSchema.virtual("subscribe").set(function (plan) {
  const now = new Date();
  this.subscription = {
    type: plan.type,
    status: "active",
    startDate: now,
    endDate: new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000),
    paymentMethod: plan.paymentMethod || "mock",
  };
});


module.exports = mongoose.model('User', userSchema);
