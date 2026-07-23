import { z } from 'zod';

function isTodayOrLater(value: string) {
  if (!value) return true;
  const due = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() >= today.getTime();
}

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or fewer'),
  description: z.string().max(2000, 'Description must be 2000 characters or fewer').optional().or(z.literal('')),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], { required_error: 'Status is required' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], { required_error: 'Priority is required' }),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || isTodayOrLater(value), 'Due date cannot be before today'),
});

export type TaskFormSchema = z.infer<typeof taskSchema>;
