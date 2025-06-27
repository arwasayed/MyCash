const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword } = require('../Controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;