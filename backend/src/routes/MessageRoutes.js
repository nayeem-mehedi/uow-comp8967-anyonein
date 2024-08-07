import { Router } from 'express';
import {
    sendMessage,
    getMessages,
    messageUsers
} from '../controllers/MessageController.js';

const router = Router();

router.get('/users', messageUsers);
router.post('/', sendMessage);
router.get('/:receiver', getMessages);

export default router;
