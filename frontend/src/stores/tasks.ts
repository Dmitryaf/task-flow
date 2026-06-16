import { tasksApi } from '@/api/endpoints/tasks';
import { type UpdateTaskData, type CreateTaskData, type Task, type TaskStatus } from '@/types/task';
import { extractApiError } from '@/utils/apiError';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;

    try {
      tasks.value = await tasksApi.getAll();
    } catch (err: unknown) {
      error.value = extractApiError(err, 'Failed to load tasks');
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (data: CreateTaskData) => {
    error.value = null;

    try {
      const task = await tasksApi.create(data);
      tasks.value.push(task);
      return true;
    } catch (err: unknown) {
      error.value = extractApiError(err, 'Failed to create task');
      return false;
    }
  };

  const updateTask = async (id: number, data: UpdateTaskData) => {
    error.value = null;

    try {
      const updatedTask = await tasksApi.update(id, data);
      const index = tasks.value.findIndex((task) => task.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      return true;
    } catch (err: unknown) {
      error.value = extractApiError(err, 'Failed to update task');
      return false;
    }
  };

  const deleteTask = async (id: number) => {
    error.value = null;

    try {
      await tasksApi.delete(id);
      tasks.value = tasks.value.filter((task) => task.id !== id);
      return true;
    } catch (err: unknown) {
      error.value = extractApiError(err, 'Failed to delete task');
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
