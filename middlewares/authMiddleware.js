// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');
const redis = require('redis');

// إنشاء عميل Redis للقائمة السوداء (إذا كنت تستخدم Redis)
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
});

// تحويل دوال Redis إلى Promise
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// كائن بديل إذا لم تستخدم Redis (لتطوير محلي فقط)
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

// التحقق من القائمة السوداء
const isTokenBlacklisted = async (token) => {
  if (process.env.USE_REDIS === 'true') {
    const result = await getAsync(`blacklist:${token}`);
    return result !== null;
  } else {
    return tokenBlacklist.has(token);
  }
};

// إضافة توكن للقائمة السوداء
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

// إزالة توكن من القائمة السوداء (إذا لزم الأمر)
exports.removeFromBlacklist = async (token) => {
  if (process.env.USE_REDIS === 'true') {
    await delAsync(`blacklist:${token}`);
  } else {
    tokenBlacklist.remove(token);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1. الحصول على التوكن من Headers أو Cookies
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. التحقق من وجود التوكن
    if (!token) {
      console.error('No token provided');
      return sendAuthError(res, 401, 'You are not logged in! Please log in to get access.');
    }

    // 3. التحقق من أن التوكن ليس في القائمة السوداء
    if (await isTokenBlacklisted(token)) {
      console.error('Blacklisted token attempt');
      return sendAuthError(res, 401, 'This session has been terminated. Please log in again.');
    }

    // 4. التحقق من تنسيق التوكن
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      console.error('Malformed token:', token);
      return sendAuthError(res, 401, 'Invalid token format');
    }

    // 5. فك تشفير التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
      algorithms: ['HS256']
    });

    // 6. التحقق من وجود ID في التوكن
    if (!decoded?.id) {
      console.error('Token missing user ID:', decoded);
      return sendAuthError(res, 401, 'Invalid token payload');
    }

    // 7. البحث عن المستخدم في قاعدة البيانات
    const currentUser = await User.findById(decoded.id)
      .select('+provider +password +passwordChangedAt');

    if (!currentUser) {
      console.error('User not found for ID:', decoded.id);
      return sendAuthError(res, 401, 'The user belonging to this token no longer exists.');
    }

    // 8. التحقق من كلمة المرور للمستخدمين المحليين
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

    // 9. تسجيل معلومات المستخدم للتصحيح
    console.log('Authenticated user:', {
      id: currentUser._id,
      email: currentUser.email,
      provider: currentUser.provider
    });

    // 10. إضافة المستخدم إلى request
    req.user = currentUser;
    req.token = token; // إضافة التوكن للطلب لاستخدامه لاحقاً
    next();
  } catch (err) {
    // 11. معالجة الأخطاء
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

// دالة مساعدة للتحقق من التوكن
exports.verifyToken = async (token) => {
  if (await isTokenBlacklisted(token)) {
    throw new Error('Token is blacklisted');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256']
  });
  
  return decoded;
};
