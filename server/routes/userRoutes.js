import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Protected routes
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

export default router;
