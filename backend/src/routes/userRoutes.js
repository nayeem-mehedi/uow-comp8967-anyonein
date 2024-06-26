import { Router } from 'express';
import {
  getUser,
  editUser,
  listUsers,
  deleteUser,
  changePassword,
} from '../controllers/userController.js';

const router = Router();

router.put('/change-password', changePassword);
router.get('/:id', getUser);
router.put('/:id', editUser);
router.get('/', listUsers);
router.delete('/:id', deleteUser);

export default router;
