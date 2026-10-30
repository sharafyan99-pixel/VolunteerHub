import Notification from '../models/Notification.js';

export function notifyUser(userId, title, text) {
  return Notification.create({ user: userId, title, text });
}
