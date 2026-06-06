import { tasksApi } from '@/api/endpoints/tasks';
import { type UpdateTaskData, type CreateTaskData, type Task, type TaskStatus } from '@/types/task';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTasks = async () => {
    loading.value = true;
    try {
      const res = await tasksApi.getAll();
      tasks.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to load tasks';
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (data: CreateTaskData) => {
    try {
      const res = await tasksApi.create(data);
      tasks.value.push(res.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create task';
      return false;
    }
  };

  const updateTask = async (id: number, data: UpdateTaskData) => {
    try {
      const res = await tasksApi.update(id, data);
      const index = tasks.value.findIndex((task) => task.id === id);
      if (index !== -1) {
        tasks.value[index] = res.data;
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update task';
      return false;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id);
      tasks.value = tasks.value.filter((task) => task.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete task';
      return false;
    }
  };

  const getTaskByStatus = (status: TaskStatus) => {
    return tasks.value.filter((task) => task.status === status);
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskByStatus,
  };
});
