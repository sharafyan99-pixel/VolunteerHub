import express from 'express';
import { listMyNotifications, markAllAsRead } from '../controllers/notificationController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();
router.use(requireLogin);
router.get('/mine', listMyNotifications);
router.put('/read', markAllAsRead);
export default router;
