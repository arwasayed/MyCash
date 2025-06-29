const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendAuthError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: 'error',
    message: message
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendAuthError(res, 401, 'You are not logged in! Please log in to get access.');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id).select('+provider +password');

    if (!currentUser) {
      return sendAuthError(res, 401, 'The user belonging to this token no longer exists.');
    }
    if (currentUser.provider === 'local' && !currentUser.password) {
      return sendAuthError(res, 401, 'Please log in using your email and password');
    }
    if (currentUser.provider === 'local' && currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      if (decoded.iat < changedTimestamp) {
        return sendAuthError(res, 401, 'User recently changed password! Please log in again.');
      }
    }
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return sendAuthError(res, 401, 'Invalid token. Please log in again!');
    }
    if (err.name === 'TokenExpiredError') {
      return sendAuthError(res, 401, 'Your token has expired! Please log in again.');
    }
    sendAuthError(res, 500, 'Authentication failed. Please try again later.');
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendAuthError(res, 403, 'You do not have permission to perform this action.');
    }
    next();
  };
};
exports.onlyForLocal = (req, res, next) => {
  if (req.user.provider !== 'local') {
    return sendAuthError(res, 403, 'This action is only available for local accounts.');
  }
  next();
};