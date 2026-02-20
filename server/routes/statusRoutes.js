import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkUserOnline, checkMultipleUsersOnline } from '../controllers/statusController.js';

const router = express.Router();

router.get('/user/:userId', protect, checkUserOnline);
router.post('/users', protect, checkMultipleUsersOnline);

export default router;