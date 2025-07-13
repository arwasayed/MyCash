const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markAllAsRead = async (req, res) => {
    try {
      await Notification.updateMany(
        { userId: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
  
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  


exports.createNotification = async (userId, message, type) => {
  try {
    await Notification.create({ userId, message, type });
  } catch (err) {
    console.error("Notification Error:", err.message);
  }
};
