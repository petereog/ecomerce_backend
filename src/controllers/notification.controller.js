const Notification = require('../models/Notification');

// GET all notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: notifications.length, notifications });
  } catch (err) {
    next(err);
  }
};

// MARK as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      const err = new Error('Notification not found');
      err.statusCode = 404;
      return next(err);
    }

    if (notification.user.toString() !== req.user.id) {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (err) {
    next(err);
  }
};

// MARK all as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// DELETE notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      const err = new Error('Notification not found');
      err.statusCode = 404;
      return next(err);
    }

    if (notification.user.toString() !== req.user.id) {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }

    await notification.deleteOne();
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};

// CREATE notification (internal use)
exports.createNotification = async (userId, title, message, type = 'general') => {
  try {
    await Notification.create({ user: userId, title, message, type });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};