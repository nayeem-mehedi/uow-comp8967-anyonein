import { Router } from 'express';
import {
  searchUsers,
  searchProjects
} from '../controllers/searchController.js';

const router = Router();

router.get('/user', searchUsers);
router.get('/project', searchProjects);

export default router;