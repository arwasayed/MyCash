const express = require('express');
const router = express.Router();

const { joinChallenge, completeChallenge, getActiveChallenges, createChallenge } = require('../Controllers/challenge');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/join/:id', protect, joinChallenge);
router.post('/complete/:id', protect, completeChallenge);
router.get('/active', protect, getActiveChallenges);
router.post('/', protect, restrictTo('admin'), createChallenge);


module.exports = router;
