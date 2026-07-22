import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface ListTasksOptions {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  sortBy?: 'newest' | 'oldest' | 'dueDate';
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  userId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

function buildWhere(options: ListTasksOptions): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = { userId: options.userId };

  if (options.search) {
    where.title = { contains: options.search, mode: 'insensitive' };
  }

  if (options.status?.length) {
    where.status = { in: options.status };
  }

  if (options.priority?.length) {
    where.priority = { in: options.priority };
  }

  return where;
}

function buildOrderBy(sortBy?: ListTasksOptions['sortBy']): Prisma.TaskOrderByWithRelationInput {
  switch (sortBy) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'dueDate':
      return { dueDate: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

export const taskRepository = {
  async findMany(options: ListTasksOptions) {
    const where = buildWhere(options);
    const orderBy = buildOrderBy(options.sortBy);
    const skip = (options.page - 1) * options.limit;

    const [items, total] = await Promise.all([
      prisma.task.findMany({ where, orderBy, skip, take: options.limit }),
      prisma.task.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: string, userId: string) {
    return prisma.task.findFirst({ where: { id, userId } });
  },

  create(input: CreateTaskInput) {
    return prisma.task.create({ data: input });
  },

  async update(id: string, userId: string, input: UpdateTaskInput) {
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return null;

    return prisma.task.update({ where: { id }, data: input });
  },

  async delete(id: string, userId: string) {
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) return null;

    return prisma.task.delete({ where: { id } });
  },

  async getDashboardStats(userId: string) {
    const now = new Date();

    const [total, pending, inProgress, completed, overdue, recent, upcoming] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: TaskStatus.PENDING } }),
      prisma.task.count({ where: { userId, status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { userId, status: TaskStatus.COMPLETED } }),
      prisma.task.count({
        where: {
          userId,
          status: { not: TaskStatus.COMPLETED },
          dueDate: { lt: now },
        },
      }),
      prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.task.findMany({
        where: {
          userId,
          status: { not: TaskStatus.COMPLETED },
          dueDate: { gte: now },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
    ]);

    return { total, pending, inProgress, completed, overdue, recent, upcoming };
  },
};
