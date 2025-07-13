const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getNotifications, markAllAsRead } = require('../Controllers/notification');

router.get('/', protect, getNotifications);
router.patch('/', protect, markAllAsRead);

module.exports = router;
