import type { TasksListResponse } from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const tasksApi = {
  getList: () => apiClient.get<TasksListResponse>(ENDPOINTS.tasks.list),
};
