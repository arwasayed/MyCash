// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const tokenBlacklist = {
  tokens: new Set(),
  add: function(token) { this.tokens.add(token); },
  has: function(token) { return this.tokens.has(token); },
  remove: function(token) { this.tokens.delete(token); }
};

const sendAuthError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: 'error',
    message: message
  });
};

const isTokenBlacklisted = async (token) => {
  if (process.env.USE_REDIS === 'true') {
    const result = await getAsync(`blacklist:${token}`);
    return result !== null;
  } else {
    return tokenBlacklist.has(token);
  }
};

exports.addToBlacklist = async (token, expiresIn) => {
  if (process.env.USE_REDIS === 'true') {
    await setAsync(`blacklist:${token}`, '1');
    if (expiresIn) {
      redisClient.expire(`blacklist:${token}`, expiresIn);
    }
  } else {
    tokenBlacklist.add(token);
  }
};

exports.removeFromBlacklist = async (token) => {
  if (process.env.USE_REDIS === 'true') {
    await delAsync(`blacklist:${token}`);
  } else {
    tokenBlacklist.remove(token);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token) {
      console.error('No token provided');
      return sendAuthError(res, 401, 'You are not logged in! Please log in to get access.');
    }
    if (await isTokenBlacklisted(token)) {
      console.error('Blacklisted token attempt');
      return sendAuthError(res, 401, 'This session has been terminated. Please log in again.');
    }

    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      console.error('Malformed token:', token);
      return sendAuthError(res, 401, 'Invalid token format');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
      algorithms: ['HS256']
    });
    if (!decoded?.id) {
      console.error('Token missing user ID:', decoded);
      return sendAuthError(res, 401, 'Invalid token payload');
    }
    const currentUser = await User.findById(decoded.id)
      .select('+provider +password +passwordChangedAt');

    if (!currentUser) {
      console.error('User not found for ID:', decoded.id);
      return sendAuthError(res, 401, 'The user belonging to this token no longer exists.');
    }

    if (currentUser.provider === 'local') {
      if (!currentUser.password) {
        console.error('Local user missing password:', currentUser.email);
        return sendAuthError(res, 401, 'Please log in using your email and password');
      }
      
      if (currentUser.passwordChangedAt) {
        const changedTimestamp = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
        if (decoded.iat < changedTimestamp) {
          console.error('Token issued before password change:', {
            tokenIssuedAt: decoded.iat,
            passwordChangedAt: changedTimestamp
          });
          return sendAuthError(res, 401, 'User recently changed password! Please log in again.');
        }
      }
    }

    console.log('Authenticated user:', {
      id: currentUser._id,
      email: currentUser.email,
      provider: currentUser.provider
    });

 
    req.user = currentUser;
    req.token = token;
    next();
  } catch (err) {
  
    console.error('Authentication error:', {
      error: err.name,
      message: err.message,
      stack: err.stack
    });

    if (err instanceof jwt.JsonWebTokenError) {
      return sendAuthError(res, 401, 'Invalid token. Please log in again!');
    }
    if (err instanceof jwt.TokenExpiredError) {
      return sendAuthError(res, 401, 'Your token has expired! Please log in again.');
    }
    sendAuthError(res, 500, 'Authentication failed. Please try again later.');
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.error('Unauthorized access attempt:', {
        userRole: req.user?.role,
        requiredRoles: roles
      });
      return sendAuthError(res, 403, 'You do not have permission to perform this action.');
    }
    next();
  };
};

exports.onlyForLocal = (req, res, next) => {
  if (req.user?.provider !== 'local') {
    console.error('Non-local access attempt:', {
      provider: req.user?.provider
    });
    return sendAuthError(res, 403, 'This action is only available for local accounts.');
  }
  next();
};
exports.verifyToken = async (token) => {
  if (await isTokenBlacklisted(token)) {
    throw new Error('Token is blacklisted');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256']
  });
  
  return decoded;
};