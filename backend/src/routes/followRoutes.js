import { Router } from 'express';
import {
    followUser,
    followProject,
    followList
} from '../controllers/FollowController.js';

const router = Router();

router.get('/user/:id', followUser);
router.get('/project/:id', followProject);
router.get('/list', followList);

export default router;
