const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { protect, onlyForLocal } = require('../middlewares/authMiddleware');
const {
  getMe,
  updateMe,
  updateAvatar,
  changePassword,
  logout,
  deleteAccount
} = require('../controllers/userSettingsController');
const multer = require('multer');
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('يسمح فقط بملفات الصور (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: fileFilter
});
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'حجم الملف كبير جداً (الحد الأقصى 5MB)' 
      });
    }
    return res.status(400).json({ 
      status: 'error', 
      message: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      status: 'error', 
      message: err.message 
    });
  }
  next();
};


router.get('/me', protect, getMe);
router.patch('/update-me', protect, updateMe);
router.patch('/update-avatar', protect, upload.single('avatar'), handleMulterError, updateAvatar);
router.post('/change-password', protect, onlyForLocal, changePassword);
router.post('/logout', protect, logout);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;