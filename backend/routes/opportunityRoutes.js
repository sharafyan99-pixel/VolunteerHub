import express from 'express';
import { listOpportunities, getOpportunity, createOpportunity, listMyOpportunities, setOpportunityStatus } from '../controllers/opportunityController.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();
router.get('/', listOpportunities);
router.get('/mine', requireLogin, requireRole('organization'), listMyOpportunities);   // must be above '/:id'
router.get('/:id', getOpportunity);
router.post('/', requireLogin, requireRole('organization'), createOpportunity);
router.put('/:id/status', requireLogin, requireRole('organization'), setOpportunityStatus);
export default router;
