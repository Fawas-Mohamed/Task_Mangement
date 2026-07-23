import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { taskSchema, TaskFormSchema } from '../../utils/schemas/taskSchema';
import { Task } from '../../types';
import { toDateInputValue } from '../../utils/format';
import { FieldWrapper, Input, Textarea } from '../ui/FormField';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (values: TaskFormSchema) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TaskForm({ initialTask, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialTask?.title ?? '',
      description: initialTask?.description ?? '',
      status: initialTask?.status ?? 'PENDING',
      priority: initialTask?.priority ?? 'MEDIUM',
      dueDate: toDateInputValue(initialTask?.dueDate),
    },
  });

  useEffect(() => {
    reset({
      title: initialTask?.title ?? '',
      description: initialTask?.description ?? '',
      status: initialTask?.status ?? 'PENDING',
      priority: initialTask?.priority ?? 'MEDIUM',
      dueDate: toDateInputValue(initialTask?.dueDate),
    });
  }, [initialTask, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldWrapper label="Title" error={errors.title?.message} htmlFor="title">
        <Input id="title" placeholder="e.g. Write API documentation" {...register('title')} error={errors.title?.message} />
      </FieldWrapper>

      <FieldWrapper label="Description" error={errors.description?.message} htmlFor="description">
        <Textarea
          id="description"
          rows={3}
          placeholder="Add more detail (optional)"
          {...register('description')}
          error={errors.description?.message}
        />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Status" error={errors.status?.message} htmlFor="status">
          <Select id="status" {...register('status')}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </FieldWrapper>

        <FieldWrapper label="Priority" error={errors.priority?.message} htmlFor="priority">
          <Select id="priority" {...register('priority')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </FieldWrapper>
      </div>

      <FieldWrapper label="Due date" error={errors.dueDate?.message} htmlFor="dueDate">
        <Input id="dueDate" type="date" {...register('dueDate')} error={errors.dueDate?.message} />
      </FieldWrapper>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : initialTask ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
