import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import {
  createTaskValidator,
  listTasksValidator,
  taskIdValidator,
  updateTaskValidator,
} from '../validators/task.validator';

const router = Router();

router.use(requireAuth);

router.get('/dashboard/stats', taskController.dashboard);
router.get('/', listTasksValidator, validateRequest, taskController.list);
router.get('/:id', taskIdValidator, validateRequest, taskController.getById);
router.post('/', createTaskValidator, validateRequest, taskController.create);
router.put('/:id', updateTaskValidator, validateRequest, taskController.update);
router.delete('/:id', taskIdValidator, validateRequest, taskController.remove);

export default router;
