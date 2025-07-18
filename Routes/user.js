const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleAuth
  // googleCallback
} = require('../Controllers/userController');
const userController = require('../Controllers/userController');

const { protect } = require('../middlewares/authMiddleware');


router.post('/signup',signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

router.post('/google', userController.googleAuth);

router.delete('/settings/delete-account', protect, userController.deleteAccount);


// //google
// router.get('/auth/google',
//   passport.authenticate('google', {
//     scope: ['email', 'profile'],
//     session: false,
//     prompt: 'select_account' 
//   })
// );
// router.get('/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login',
//     session: false
//   }),
//   googleCallback 
// );

module.exports = router;
