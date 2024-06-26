import { Router } from 'express';
import {
  createProfile,
  getProfile,
  updateProfile,
  getSelfProfile
} from '../controllers/profileController.js';

const router = Router();

router.post('/', createProfile);
router.get('/self', getSelfProfile);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);

export default router;
