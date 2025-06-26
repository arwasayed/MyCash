const express = require('express');
const router = express.Router();
const { auth, restrictTo } = require('../middlewares/auth');
const {getBadges, getUserBadges, deleteBadge, createBadge } = require('../controllers/badge');


router.get('/', auth, getBadges);
router.get('/user', auth, getUserBadges);
router.post('/', auth, restrictTo('admin'), createBadge);
router.delete('/:id', auth, restrictTo('admin'), deleteBadge);

module.exports = router;
