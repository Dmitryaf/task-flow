import { type UpdateTaskData, type CreateTaskData, type Task } from '@/types/task';
import api from '..';

export const tasksApi = {
  getAll: () => api.get<Task[]>('/tasks'),
  create: (data: CreateTaskData) => api.post<Task>('/tasks', data),
  update: (id: number, data: UpdateTaskData) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};
