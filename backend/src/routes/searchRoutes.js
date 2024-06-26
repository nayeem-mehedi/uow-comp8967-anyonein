import { Router } from 'express';
import {
  searchUsers,
} from '../controllers/searchController.js';

const router = Router();

router.get('/user', searchUsers);

export default router;