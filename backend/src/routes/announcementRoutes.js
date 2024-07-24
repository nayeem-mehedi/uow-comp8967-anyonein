import {Router} from 'express';
import {
    createAnnouncementUser,
    createAnnouncementProject, listAnnouncementsByUser, listAnnouncementsByProject
} from '../controllers/AnnouncementController.js';

const router = Router();

router.post('/user', createAnnouncementUser);
router.get('/user/:id', listAnnouncementsByUser);
router.post('/project', createAnnouncementProject);
router.get('/project/:id', listAnnouncementsByProject);

export default router;