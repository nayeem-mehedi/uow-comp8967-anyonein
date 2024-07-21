import { Router } from 'express';
import {
    createAnnouncementUser,
    createAnnouncementProject
} from '../controllers/AnnouncementController.js';

const router = Router();

router.post('/user', createAnnouncementUser);
router.post('/project', createAnnouncementProject);

export default router;