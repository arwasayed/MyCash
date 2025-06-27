const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

const sendResponse = (res, statusCode, status, data, message) => {
  res.status(statusCode).json({ status, data, message });
};

exports.signup = async (req, res) => {
  try {
    const { email, phone, password, nickname } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return sendResponse(res, 400, 'error', null, 'Email or phone already exists');
    }
    const newUser = await User.create({
      email,
      phone,
      password,
      nickname: nickname || 'User',
      role: 'user'
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    newUser.password = undefined;

    sendResponse(res, 201, 'success', {
      token,
      user: newUser
    }, 'User created successfully');

  } catch (err) {
    sendResponse(res, 400, 'error', null, err.message);
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, 'error', null, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, 401, 'error', null, 'Incorrect email or password');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
    user.password = undefined;

    sendResponse(res, 200, 'success', {
      token,
      user
    }, 'Logged in successfully');

  } catch (err) {
    sendResponse(res, 400, 'error', null, err.message);
  }
};



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, 'error', null, 'No user found with this email');
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    
    const message = `
Dear ${user.nickname || 'User'},

You requested a password reset for your ${process.env.APP_NAME} account.

🔐 Reset your password here (valid for 10 minutes):
${resetUrl}

Security Tips:
• Don't share this link with anyone
• Link will expire at ${new Date(user.resetPasswordExpire).toLocaleTimeString()}
• IP: ${req.ip}

If you didn't request this, please ignore this email.

${process.env.APP_NAME} Team
`;
    await sendEmail({
      email: user.email,
      subject: `Password Reset Request - ${process.env.APP_NAME}`,
      message
    });
    sendResponse(res, 200, 'success', null, 'Password reset token sent to email');
  } catch (err) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    sendResponse(res, 500, 'error', null, 'Error sending email. Please try again later.');
  }
};






exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return sendResponse(res, 400, 'error', null, 'Token is invalid or has expired');
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendResponse(res, 200, 'success', null, 'Password has been updated successfully');
  } catch (err) {
    sendResponse(res, 500, 'error', null, 'Error resetting password. Please try again.');
  }
};