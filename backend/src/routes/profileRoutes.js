import { Router } from 'express';
import {
  createProfile,
  getProfile,
  updateProfile,
} from '../controllers/profileController.js';

const router = Router();

router.post('/', createProfile);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);

export default router;
