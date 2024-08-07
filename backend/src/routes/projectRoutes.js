import { Router } from 'express';
import {
    createProject,
    deleteProject,
    listProject,
    listProjectSelf,
    detailsProject,
    updateProject,
    joinRequest,
    joinRequestList,
    acceptRejectRequest
} from '../controllers/projectController.js';

const router = Router();

router.get('/', listProject);
router.get('/self-project', listProjectSelf);
router.post('/', createProject);
router.get('/:id', detailsProject);
router.put('/:id', updateProject)
router.delete('/:id', deleteProject);
router.post('/:id/join', joinRequest)
router.get('/:id/join-requests', joinRequestList);
router.patch('/join-requests/:id', acceptRejectRequest);

export default router;
