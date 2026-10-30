import express from 'express';
import { listMyCertificates, verifyCertificate, listIssuable, issueCertificate } from '../controllers/certificateController.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();
router.get('/verify/:number', verifyCertificate);   // public
router.get('/mine', requireLogin, requireRole('volunteer'), listMyCertificates);
router.get('/issuable', requireLogin, requireRole('organization'), listIssuable);
router.post('/', requireLogin, requireRole('organization'), issueCertificate);
export default router;
