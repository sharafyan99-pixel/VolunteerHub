// All addresses of the API, each group in its own file.
import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import opportunityRoutes from './opportunityRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import hourRoutes from './hourRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import calendarRoutes from './calendarRoutes.js';

const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'API is working' }));   // quick test in Postman
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/hours', hourRoutes);
router.use('/certificates', certificateRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/calendar', calendarRoutes);
export default router;
