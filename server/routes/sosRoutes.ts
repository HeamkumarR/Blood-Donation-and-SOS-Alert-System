/**
 * Emergency SOS Alert Routes
 */
import { Router } from 'express';
import {
  triggerSOSAlert,
  getActiveSOSAlerts,
  updateSOSStatus,
} from '../controllers/sosController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/trigger', triggerSOSAlert);
router.get('/active', getActiveSOSAlerts);
router.patch('/:id/status', authorize('ADMIN'), updateSOSStatus);

export default router;
