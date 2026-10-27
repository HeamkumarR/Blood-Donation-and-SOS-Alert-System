/**
 * Authentication Routes
 */
import { Router } from 'express';
import { register, login, getMe, forgotPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

export default router;
