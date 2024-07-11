import { Router } from 'express';
import { createProject, deleteProject, listProject, detailsProject } from '../controllers/projectController.js';

const router = Router();

router.get('/', listProject);
router.post('/', createProject);
router.get('/:id', detailsProject);
router.delete('/:id', deleteProject);

export default router;
