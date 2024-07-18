import { Router } from 'express';
import { createProject, deleteProject, listProject, detailsProject, updateProject } from '../controllers/projectController.js';

const router = Router();

router.get('/', listProject);
router.post('/', createProject);
router.get('/:id', detailsProject);
router.put('/:id', updateProject)
router.delete('/:id', deleteProject);

export default router;
