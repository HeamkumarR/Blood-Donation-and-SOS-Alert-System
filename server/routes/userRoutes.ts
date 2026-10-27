/**
 * User & Donor Routes
 */
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  toggleAvailability,
  searchNearbyDonors,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/toggle-availability', toggleAvailability);
router.get('/nearby-donors', searchNearbyDonors);

export default router;
