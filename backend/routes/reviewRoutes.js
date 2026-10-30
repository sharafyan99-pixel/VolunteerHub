import express from 'express';
import { createReview, listReceivedReviews } from '../controllers/reviewController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();
router.use(requireLogin);
router.post('/', createReview);
router.get('/received', listReceivedReviews);
export default router;
