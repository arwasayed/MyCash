const express = require('express');
const router = express.Router();

const { joinChallenge, completeChallenge, getUserChallenges, createChallenge, getAllChallenges, updateChallenge, deleteChallenge } = require('../Controllers/challenge');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get("/", protect, restrictTo('admin'), getAllChallenges);
router.put("/:id", protect,restrictTo('admin'), updateChallenge);
router.delete("/:id", protect, restrictTo('admin'), deleteChallenge);
router.post('/join/:id', protect, joinChallenge);
router.post('/complete/:id', protect, completeChallenge);
router.get('/active', protect, getUserChallenges);
router.post('/', protect, restrictTo('admin'), createChallenge);


module.exports = router;
