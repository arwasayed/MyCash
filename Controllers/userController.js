
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
// const passport = require('passport');
// const OAuth2Client = require ('google-auth-library');




//client token
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendResponse = (res, statusCode, status, data, message) => {
  res.status(statusCode).json({ status, data, message });
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

//signup
exports.signup = async (req, res) => {
  try {
   const { email, password, passwordConfirm, nickname } = req.body;
    if (password !== passwordConfirm) {
      return sendResponse(res, 400, 'error', null, 'كلمة المرور وتأكيدها غير متطابقين');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, 'error', null, 'البريد الإلكتروني مسجل بالفعل');
    }
    const newUser = await User.create({
      email,
      password,
      nickname: nickname || 'User',
      role: 'user',
      emailVerified: false 
    });
    const verifyToken = newUser.createEmailVerifyToken();
    await newUser.save({ validateBeforeSave: false });
    const verifyUrl = `${process.env.BASE_URL}/verify-email/${verifyToken}`;
    const message = `
      عزيزي ${newUser.nickname || 'المستخدم'}،
      شكراً لتسجيلك في ${process.env.APP_NAME}!
      يرجى النقر على الرابط التالي لتفعيل حسابك:
      ${verifyUrl}
      الرابط صالح لمدة 24 ساعة.
      فريق ${process.env.APP_NAME}
    `;
    await sendEmail({
      email: newUser.email,
      subject: `تفعيل الحساب - ${process.env.APP_NAME}`,
      message
    });
    newUser.password = undefined;

    sendResponse(res, 201, 'success', {
      user: newUser
    }, 'تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك عبر الرابط المرسل إلى بريدك الإلكتروني.');

  } catch (err) {
    sendResponse(res, 400, 'error', null, err.message);
  }
};



//verifyEmail
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpire: { $gt: Date.now() }
    });
    if (!user) {
      return sendResponse(res, 400, 'error', null, 'رابط التفعيل غير صالح أو منتهي الصلاحية');
    }
    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();
    const token = generateToken(user._id);
    sendResponse(res, 200, 'success', {
      token,
      user
    }, 'تم تفعيل الحساب بنجاح!');

  } catch (err) {
    sendResponse(res, 500, 'error', null, 'حدث خطأ أثناء تفعيل الحساب');
  }
};


//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, 'error', null, 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, 401, 'error', null, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    if (user.provider === 'local' && !user.emailVerified) {
      return sendResponse(res, 403, 'error', null, 'الحساب غير مفعل. يرجى تفعيل حسابك عبر الرابط المرسل إلى بريدك الإلكتروني');
    }
    const token = generateToken(user._id);
    user.password = undefined;

    sendResponse(res, 200, 'success', {
      token,
      user
    }, 'تم تسجيل الدخول بنجاح');

  } catch (err) {
    sendResponse(res, 400, 'error', null, err.message);
  }
};



//forgotPassword 
exports.forgotPassword = async (req, res) => {
  let user;
  try {
    const { email } = req.body;
    user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, 'error', null, 'لا يوجد حساب مسجل بهذا البريد الإلكتروني');
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/ResetPassword2/${resetToken}`;
    const message = `
    عزيزي ${user.nickname || 'المستخدم'}،
    لقد طلبت إعادة تعيين كلمة المرور لحسابك في ${process.env.APP_NAME}.
   🔐 يمكنك إعادة تعيين كلمة المرور من هنا (صالحة لمدة 10 دقائق):
   ${resetUrl}
   تعليمات الأمان:
   • لا تشارك هذا الرابط مع أي شخص
   • سينتهي الرابط في الساعة ${new Date(user.resetPasswordExpire).toLocaleTimeString()}
   • عنوان IP: ${req.ip}
   عند النقر على الرابط، سيُطلب منك إدخال:
   1. كلمة المرور الجديدة
   2. تأكيد كلمة المرور الجديدة
   إذا لم تطلب هذا، يرجى تجاهل هذا البريد.
   فريق ${process.env.APP_NAME}
   `;
    await sendEmail({
      email: user.email,
      subject: `طلب إعادة تعيين كلمة المرور - ${process.env.APP_NAME}`,
      message
    });
    sendResponse(res, 200, 'success', null, 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
  } catch (err) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    sendResponse(res, 500, 'error', null, 'حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً.');
  }
};




//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    const { password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
      return sendResponse(res, 400, 'error', null, 'كلمة المرور وتأكيدها غير متطابقين');
    }
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
      return sendResponse(res, 400, 'error', null, 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية');
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendResponse(res, 200, 'success', null, 'تم تحديث كلمة المرور بنجاح');
  } catch (err) {
    sendResponse(res, 500, 'error', null, 'حدث خطأ أثناء تحديث كلمة المرور. يرجى المحاولة لاحقاً.');
  }
};

// // Google Authentication
// exports.googleAuth = async (req, res) => {
//   try {
//     const { credential } = req.body;

//     if (!credential) {
//       return sendResponse(res, 400, 'error', null, 'رمز Google مطلوب');
//     }

//     // Verify the Google ID token
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, sub: googleId, name, picture } = payload;

//     // Check if the user exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Register new user
//       user = await User.create({
//         email,
//         nickname: name || 'User',
//         googleId,
//         provider: 'google',
//         role: 'user',
//         emailVerified: true, // Google verified emails are considered verified
//         photo: picture
//       });
//     } else if (user.provider !== 'google') {
//       // User exists but didn't register with Google
//       return sendResponse(res, 400, 'error', null, 'هذا البريد الإلكتروني مسجل بالفعل بطريقة أخرى');
//     }

//     // Generate JWT token
//     const token = generateToken(user._id);

//     sendResponse(res, 200, 'success', {
//       token,
//       user
//     }, 'تم تسجيل الدخول بنجاح عبر Google');

//   } catch (err) {
//     console.error('Google auth error:', err);
//     sendResponse(res, 401, 'error', null, 'فشل المصادقة عبر Google');
//   }
//   };




// Google Authentication (Login or Register)
exports.googleAuth = async (req, res) => {
  try {
    const { credential, mode } = req.body; // ← أضفنا mode (login | register)

    if (!credential) {
      return sendResponse(res, 400, 'error', null, 'رمز Google مطلوب');
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;

    let user = await User.findOne({ email });

    if (mode === 'login') {
      if (!user) {
        return sendResponse(res, 404, 'error', null, 'هذا البريد الإلكتروني غير مسجل. يرجى التسجيل أولاً.');
      }
      if (user.provider !== 'google') {
        return sendResponse(res, 400, 'error', null, 'هذا البريد الإلكتروني مسجل بطريقة أخرى. سجل دخولك بنفس الطريقة.');
      }
    }

    if (mode === 'register') {
      if (user) {
        return sendResponse(res, 400, 'error', null, 'البريد الإلكتروني مسجل بالفعل');
      }

      user = await User.create({
        email,
        nickname: name || 'User',
        googleId,
        provider: 'google',
        emailVerified: true,
        photo: picture,
        role: 'user'
      });
    }

    const token = generateToken(user._id);

    sendResponse(res, 200, 'success', {
      token,
      user
    }, mode === 'login' ? 'تم تسجيل الدخول بنجاح عبر Google' : 'تم إنشاء الحساب بنجاح عبر Google');

  } catch (err) {
    console.error('Google auth error:', err);
    sendResponse(res, 401, 'error', null, 'فشل المصادقة عبر Google');
  }
};




// //googleLogin
// exports.googleLogin = passport.authenticate('google', {
//   scope: ['email', 'profile'],
//   session: false,
//   prompt: 'select_account'
// });


// //googleCallback
// exports.googleCallback = async (req, res, next) => {
//   passport.authenticate('google', {
//     session: false,
//     failureMessage: true
//   }, async (err, user, info) => {
//     try {
//       console.log('Google Auth Data:', { err, user, info });
//       if (err || !user || !user.emails || !user.emails[0]) {
//         console.error('Google Auth Failed:', {
//           error: err,
//           userData: user,
//           info
//         });
//         return sendResponse(res, 401, 'error', null, 'فشل المصادقة باستخدام جوجل');
//       }
//       const email = user.emails[0].value;
//       const nickname = user.displayName || `مستخدم${Math.floor(Math.random() * 10000)}`;
//       const avatar = user.photos?.[0]?.value || 'default-avatar.png';
//       let existingUser = await User.findOne({
//         $or: [
//           { email },
//           { googleId: user.id }
//         ]
//       });
//       if (!existingUser) {
//         existingUser = await User.create({
//           email,
//           nickname,
//           avatar,
//           provider: 'google',
//           googleId: user.id,
//           emailVerified: true,
//           role: 'user'
//         });
//         console.log('New Google User:', existingUser);
//       } else {
//         existingUser.avatar = avatar;
//         existingUser.googleId = user.id;
//         await existingUser.save();
//         console.log('Updated Google User:', existingUser);
//       }
//       const token = generateToken(existingUser._id);
//       sendResponse(res, 200, 'success', {
//         token,
//         user: {
//           _id: existingUser._id,
//           email: existingUser.email,
//           nickname: existingUser.nickname,
//           avatar: existingUser.avatar,
//           role: existingUser.role,
//           provider: existingUser.provider
//         }
//       }, 'تم تسجيل الدخول باستخدام جوجل بنجاح');

//     } catch (error) {
//       console.error('Google Callback Error:', {
//         message: error.message,
//         stack: error.stack
//       });
//       sendResponse(res, 500, 'error', null, 'حدث خطأ أثناء المصادقة باستخدام جوجل');
//     }
//   })(req, res, next);
// };
