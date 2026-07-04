const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      'recipients.user': req.user._id,
    })
      .populate('sender', 'name email role')
      .populate('relatedIncident', 'title status severity')
      .sort('-createdAt')
      .limit(50);

    const formatted = notifications.map((n) => {
      const recipient = n.recipients.find((r) => r.user.toString() === req.user._id.toString());
      return {
        ...n.toObject(),
        isRead: recipient?.isRead || false,
        readAt: recipient?.readAt,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const recipient = notification.recipients.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (recipient) {
      recipient.isRead = true;
      recipient.readAt = new Date();
      await notification.save();
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ 'recipients.user': req.user._id });

    for (const notification of notifications) {
      const recipient = notification.recipients.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (recipient && !recipient.isRead) {
        recipient.isRead = true;
        recipient.readAt = new Date();
        await notification.save();
      }
    }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.sendEmergencyAlert = async (req, res, next) => {
  try {
    const { title, message, priority } = req.body;

    const users = await User.find({ isActive: true }).select('_id');
    const recipients = users.map((u) => ({ user: u._id }));

    const notification = await Notification.create({
      title,
      message,
      type: 'emergency',
      priority: priority || 'Critical',
      sender: req.user._id,
      recipients,
      isBroadcast: true,
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

exports.getNotificationHistory = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ isBroadcast: true })
      .populate('sender', 'name email')
      .sort('-createdAt')
      .limit(20);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipients: {
        $elemMatch: {
          user: req.user._id,
          isRead: false,
        },
      },
    });
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};
