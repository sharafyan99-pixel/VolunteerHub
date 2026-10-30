import express from 'express';
import { logHours, listMyHours, listPendingHours, setHourStatus } from '../controllers/hourController.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();
router.use(requireLogin);
router.post('/', requireRole('volunteer'), logHours);
router.get('/mine', requireRole('volunteer'), listMyHours);
router.get('/pending', requireRole('organization'), listPendingHours);
router.put('/:id/status', requireRole('organization'), setHourStatus);
export default router;
