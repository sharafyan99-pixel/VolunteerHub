import express from 'express';
import { listMyCalendarEvents } from '../controllers/calendarController.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();
router.get('/mine', requireLogin, requireRole('volunteer'), listMyCalendarEvents);
export default router;
