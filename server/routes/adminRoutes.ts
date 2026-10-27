/**
 * Administrative Routes (Strictly Protected by Role 'ADMIN')
 */
import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserVerification,
  updateRequestStatus,
  deleteRequest,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protect all routes: Must be authenticated AND have role 'ADMIN'
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/verify', toggleUserVerification);
router.patch('/requests/:id/status', updateRequestStatus);
router.delete('/requests/:id', deleteRequest);

export default router;
