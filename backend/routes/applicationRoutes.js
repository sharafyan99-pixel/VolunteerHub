import express from 'express';
import { applyToOpportunity, listMyApplications, withdrawApplication, listReceivedApplications, setApplicationStatus } from '../controllers/applicationController.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();
router.use(requireLogin);
router.post('/', requireRole('volunteer'), applyToOpportunity);
router.get('/mine', requireRole('volunteer'), listMyApplications);
router.delete('/:id', requireRole('volunteer'), withdrawApplication);
router.get('/received', requireRole('organization'), listReceivedApplications);
router.put('/:id/status', requireRole('organization'), setApplicationStatus);
export default router;
