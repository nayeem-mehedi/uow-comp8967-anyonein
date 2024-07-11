import { Router } from 'express';
import {
    createTopic,
    deleteTopic,
    listTopic
} from '../controllers/topicController.js';

const router = Router();

router.get('/', listTopic);
router.post('/', createTopic);
router.delete('/:id', deleteTopic);

export default router;
