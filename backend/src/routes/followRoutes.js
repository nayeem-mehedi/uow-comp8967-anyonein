import { Router } from 'express';
import {
    followUser,
    followProject,
    followList
} from '../controllers/FollowController.js';

const router = Router();

router.post('/user/:id', followUser);
router.post('/project/:id', followProject);
router.get('/list', followList);

export default router;
