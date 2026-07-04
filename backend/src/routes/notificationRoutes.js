const express = require('express');
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  sendEmergencyAlert,
  getNotificationHistory,
  getUnreadCount,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');
const { alertValidation } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.post('/emergency', authorize('admin'), alertValidation, sendEmergencyAlert);
router.get('/history', authorize('admin'), getNotificationHistory);

module.exports = router;
