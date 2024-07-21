import { Router } from 'express';
import {
    countNotifications,
    listNotifications,
    getNotification
} from '../controllers/NotificationController.js';

const router = Router();

router.get('/', listNotifications);
router.get('/count', countNotifications);
router.get('/:id', getNotification);

export default router;
