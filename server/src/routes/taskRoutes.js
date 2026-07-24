import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  acceptTask,
  completeTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id/accept', acceptTask);
router.put('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
