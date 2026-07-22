import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { taskService } from '../services/task.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AppError } from '../utils/AppError';

export const taskController = {
  list: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { page, limit, search, status, priority, sortBy } = req.query as Record<string, unknown>;

    const result = await taskService.list(userId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string | undefined,
      status: status as string | string[] | undefined,
      priority: priority as string | string[] | undefined,
      sortBy: sortBy as 'newest' | 'oldest' | 'dueDate' | undefined,
    });

    res.status(200).json({ success: true, data: result.items, pagination: result.pagination });
  }),

  getById: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.getById(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: task });
  }),

  create: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.create(req.user!.id, req.body);
    res.status(201).json({ success: true, message: 'Task created', data: task });
  }),

  update: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.update(req.params.id, req.user!.id, req.body);
    res.status(200).json({ success: true, message: 'Task updated', data: task });
  }),

  remove: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await taskService.remove(req.params.id, req.user!.id);
    res.status(200).json({ success: true, message: 'Task deleted' });
  }),

  dashboard: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const stats = await taskService.getDashboardStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  }),
};
