import { api } from './apiClient';
import { LoginResponse } from '../types';

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
