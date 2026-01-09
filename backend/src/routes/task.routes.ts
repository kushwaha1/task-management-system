import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../controllers/task.controller';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  taskQueryValidation,
} from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', taskQueryValidation, getTasks);
router.post('/', createTaskValidation, createTask);
router.get('/:id', taskIdValidation, getTaskById);
router.patch('/:id', [...taskIdValidation, ...updateTaskValidation], updateTask);
router.delete('/:id', taskIdValidation, deleteTask);
router.post('/:id/toggle', taskIdValidation, toggleTaskStatus);

export default router;