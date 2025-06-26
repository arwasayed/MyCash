const express = require('express');
const router = express.Router();

const { joinChallenge, completeChallenge, getActiveChallenges, createChallenge } = require('../controllers/challenge');
const { auth, restrictTo } = require('../middlewares/auth');

router.post('/join/:id', auth, joinChallenge);
router.post('/complete/:id', auth, completeChallenge);
router.get('/active', auth, getActiveChallenges);
router.post('/', auth, restrictTo('admin'), createChallenge);


module.exports = router;
