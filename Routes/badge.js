const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {getBadges, getUserBadges, deleteBadge, createBadge } = require('../Controllers/badge');


router.get('/', protect, getBadges);
router.get('/user', protect, getUserBadges);
router.post('/', protect, restrictTo('admin'), createBadge);
router.delete('/:id', protect, restrictTo('admin'), deleteBadge);

module.exports = router;
