const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getNotifications, markAllAsRead } = require('../Controllers/notification');
const notificationController = require('../Controllers/notification');


router.get('/', protect, getNotifications);
router.patch('/', protect, markAllAsRead);


// إرسال إشعار يدوي للاختبار
router.post('/test', protect, async (req, res) => {
  const { message, type } = req.body;
  await notificationController.createNotification(req.user._id, message, type || 'challenge');
  res.json({ success: true, message: 'تم إرسال الإشعار' });
});


module.exports = router;
