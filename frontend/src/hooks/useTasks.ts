import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { taskApi } from '../services/taskApi';
import { TaskFormValues, TaskListParams } from '../types';

export const taskKeys = {
  all: ['tasks'] as const,
  list: (params: TaskListParams) => [...taskKeys.all, 'list', params] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
  dashboard: ['dashboard-stats'] as const,
};

export function useTasks(params: TaskListParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => taskApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ''),
    queryFn: () => taskApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: taskKeys.dashboard,
    queryFn: () => taskApi.dashboardStats(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: TaskFormValues) => taskApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.dashboard });
      toast.success('Task created');
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, 'Could not create task'));
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<TaskFormValues> }) => taskApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.dashboard });
      toast.success('Task updated');
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, 'Could not update task'));
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.dashboard });
      toast.success('Task deleted');
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, 'Could not delete task'));
    },
  });
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? fallback;
  }
  return fallback;
}
