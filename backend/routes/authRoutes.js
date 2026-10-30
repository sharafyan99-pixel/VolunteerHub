import express from 'express';
import { signup, login, changePassword } from '../controllers/authController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.put('/password', requireLogin, changePassword);
export default router;
