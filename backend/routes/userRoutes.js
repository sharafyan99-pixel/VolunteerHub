import express from 'express';
import { getMyProfile, updateMyProfile, updateMySettings } from '../controllers/userController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();
router.use(requireLogin);
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.put('/me/settings', updateMySettings);
export default router;
