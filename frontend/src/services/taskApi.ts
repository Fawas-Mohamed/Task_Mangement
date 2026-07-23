import { api } from './apiClient';
import { DashboardStats, Task, TaskFormValues, TaskListParams, TaskListResponse } from '../types';

function buildParams(params: TaskListParams) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  params.status?.forEach((s) => searchParams.append('status', s));
  params.priority?.forEach((p) => searchParams.append('priority', p));

  return searchParams;
}

export const taskApi = {
  async list(params: TaskListParams): Promise<TaskListResponse> {
    const { data } = await api.get<TaskListResponse>('/tasks', { params: buildParams(params) });
    return data;
  },

  async getById(id: string): Promise<Task> {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data;
  },

  async create(values: TaskFormValues): Promise<Task> {
    const { data } = await api.post('/tasks', values);
    return data.data;
  },

  async update(id: string, values: Partial<TaskFormValues>): Promise<Task> {
    const { data } = await api.put(`/tasks/${id}`, values);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async dashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get('/tasks/dashboard/stats');
    return data.data;
  },
};
