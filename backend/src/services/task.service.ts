import { TaskPriority, TaskStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { taskRepository } from '../repositories/task.repository';

export interface ListTasksQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string | string[];
  priority?: string | string[];
  sortBy?: 'newest' | 'oldest' | 'dueDate';
}

function toArray(value?: string | string[]): string[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

export const taskService = {
  async list(userId: string, query: ListTasksQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, total } = await taskRepository.findMany({
      userId,
      page,
      limit,
      search: query.search,
      status: toArray(query.status) as TaskStatus[] | undefined,
      priority: toArray(query.priority) as TaskPriority[] | undefined,
      sortBy: query.sortBy,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async getById(id: string, userId: string) {
    const task = await taskRepository.findById(id, userId);
    if (!task) throw AppError.notFound('Task not found');
    return task;
  },

  create(
    userId: string,
    input: {
      title: string;
      description?: string | null;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate?: string | null;
    }
  ) {
    return taskRepository.create({
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId,
    });
  },

  async update(
    id: string,
    userId: string,
    input: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
    }
  ) {
    const updated = await taskRepository.update(id, userId, {
      ...input,
      dueDate: input.dueDate === undefined ? undefined : input.dueDate ? new Date(input.dueDate) : null,
    });

    if (!updated) throw AppError.notFound('Task not found');
    return updated;
  },

  async remove(id: string, userId: string) {
    const deleted = await taskRepository.delete(id, userId);
    if (!deleted) throw AppError.notFound('Task not found');
    return deleted;
  },

  getDashboardStats(userId: string) {
    return taskRepository.getDashboardStats(userId);
  },
};
