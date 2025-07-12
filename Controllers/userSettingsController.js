// controllers/userSettingsController.js
const User = require('../models/userModel');
const sendResponse = require('../utils/sendResponse');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// show 
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, 'error', null, 'المستخدم غير موجود');
    }
    sendResponse(res, 200, 'success', { user }, 'تم جلب البيانات بنجاح');
  } catch (err) {
    sendResponse(res, 500, 'error', null, err.message);
  }
};

//update nickname, language
exports.updateMe = async (req, res) => {
  try {
    const { nickname, language, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nickname, language, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendResponse(res, 404, 'error', null, 'المستخدم غير موجود');
    }

    sendResponse(res, 200, 'success', { user }, 'تم التحديث بنجاح');
  } catch (err) {
    sendResponse(res, 400, 'error', null, err.message);
  }
};

// updateAvatar
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, 'error', null, 'لم يتم رفع أي ملف');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      await fs.promises.unlink(req.file.path).catch(console.error);
      return sendResponse(res, 404, 'error', null, 'المستخدم غير موجود');
    }
    const processedFilename = `processed-${req.file.filename}`;
    const processedImagePath = path.join(path.dirname(req.file.path), processedFilename);
    const circleShape = Buffer.from(`<svg><circle cx="250" cy="250" r="250" /></svg>`);

    await sharp(req.file.path)
      .resize(500, 500)
      .composite([{ input: circleShape, blend: 'dest-in' }])
      .png()
      .toFile(processedImagePath);
    await fs.promises.unlink(req.file.path).catch(console.error);
    if (user.avatar && user.avatar !== 'default-avatar.png') {
      const oldAvatarPath = path.join(__dirname, '../', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        await fs.promises.unlink(oldAvatarPath).catch(console.error);
      }
    }
    const avatarPath = `/uploads/${processedFilename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );

    sendResponse(res, 200, 'success', { 
      user: updatedUser,
      avatarUrl: avatarPath
    }, 'تم تحديث الصورة بنجاح');

  } catch (err) {
    console.error('Update avatar error:', err);
    
    try {
      if (req.file?.path) await fs.promises.unlink(req.file.path);
      const processedPath = path.join(path.dirname(req.file?.path || ''), `processed-${req.file?.filename || ''}`);
      if (fs.existsSync(processedPath)) await fs.promises.unlink(processedPath);
    } catch (cleanupErr) {
      console.error('Error during cleanup:', cleanupErr);
    }
    
    sendResponse(res, 500, 'error', null, err.message || 'حدث خطأ أثناء تحديث الصورة');
  }
};

// changePassword
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return sendResponse(res, 404, 'error', null, 'المستخدم غير موجود');
    }
    if (!(await user.comparePassword(currentPassword))) {
      return sendResponse(res, 401, 'error', null, 'كلمة المرور الحالية غير صحيحة');
    }
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    sendResponse(res, 200, 'success', null, 'تم تغيير كلمة المرور بنجاح');
  } catch (err) {
    sendResponse(res, 400, 'error', null, err.message);
  }
};

// logout
exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    sendResponse(res, 200, 'success', null, 'تم تسجيل الخروج بنجاح');
  } catch (err) {
    sendResponse(res, 500, 'error', null, err.message);
  }
};

// deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return sendResponse(res, 404, 'error', null, 'المستخدم غير موجود');
    }
    if (user.provider === 'local' && !(await user.comparePassword(password))) {
      return sendResponse(res, 401, 'error', null, 'كلمة المرور غير صحيحة');
    }
    if (user.avatar && user.avatar !== 'default-avatar.png') {
      const avatarPath = path.join(__dirname, '../', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('token');
    
    sendResponse(res, 200, 'success', null, 'تم حذف الحساب بنجاح');
  } catch (err) {
    sendResponse(res, 500, 'error', null, err.message);
  }
};