import { type UpdateTaskData, type CreateTaskData, type Task } from '@/types/task';
import api from '..';

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  create: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },
  update: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
