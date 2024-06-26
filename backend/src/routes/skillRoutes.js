import { Router } from 'express';
import {
  createSkill,
  getSkills,
  deleteSkill,
} from '../controllers/skillController.js';

const router = Router();

router.post('/', createSkill);
router.get('/', getSkills);
router.delete('/:id', deleteSkill);

export default router;
