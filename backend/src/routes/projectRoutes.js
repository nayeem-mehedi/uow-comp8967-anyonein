import { Router } from 'express';
import { createProject, deleteProject, listProject, listProjectSelf, detailsProject, updateProject } from '../controllers/projectController.js';

const router = Router();

router.get('/', listProject);
router.get('/self-project', listProjectSelf);
router.post('/', createProject);
router.get('/:id', detailsProject);
router.put('/:id', updateProject)
router.delete('/:id', deleteProject);

export default router;
