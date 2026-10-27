/**
 * Blood Request Routes
 */
import { Router } from 'express';
import {
  createBloodRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
} from '../controllers/requestController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', createBloodRequest);
router.get('/my-requests', getMyRequests);
router.get('/:id', getRequestById);
router.patch('/:id/cancel', cancelRequest);

export default router;
