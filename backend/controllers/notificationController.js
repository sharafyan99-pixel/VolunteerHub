import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { formatNotification } from '../utils/formatters.js';

// GET /api/notifications/mine
export const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications.map(formatNotification));
});

// PUT /api/notifications/read
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
});
