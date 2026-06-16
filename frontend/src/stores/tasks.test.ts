import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tasksApi } from '@/api/endpoints/tasks';
import { useTasksStore } from '@/stores/tasks';
import { type Task } from '@/types/task';

vi.mock('@/api/endpoints/tasks', () => ({
  tasksApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const tasksApiMock = vi.mocked(tasksApi);

const firstTask: Task = {
  id: 1,
  title: 'First task',
  status: 'todo',
  userId: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const secondTask: Task = {
  id: 2,
  title: 'Second task',
  status: 'done',
  userId: 1,
  createdAt: '2026-01-02T00:00:00.000Z',
};

describe('tasks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('starts with empty tasks state', () => {
    const store = useTasksStore();

    expect(store.tasks).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetches tasks into the store', async () => {
    tasksApiMock.getAll.mockResolvedValue([firstTask, secondTask]);
    const store = useTasksStore();

    await store.fetchTasks();

    expect(store.tasks).toEqual([firstTask, secondTask]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('sets error after failed fetch', async () => {
    tasksApiMock.getAll.mockRejectedValue(new Error('Network failed'));
    const store = useTasksStore();

    await store.fetchTasks();

    expect(store.tasks).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe('Failed to load tasks');
  });

  it('adds a created task', async () => {
    tasksApiMock.create.mockResolvedValue(firstTask);
    const store = useTasksStore();

    const result = await store.addTask({ title: 'First task' });

    expect(result).toBe(true);
    expect(store.tasks).toEqual([firstTask]);
    expect(store.error).toBeNull();
  });

  it('updates an existing task in the list', async () => {
    const updatedTask: Task = {
      ...firstTask,
      title: 'Updated task',
      status: 'in-progress',
    };
    tasksApiMock.update.mockResolvedValue(updatedTask);
    const store = useTasksStore();
    store.tasks = [firstTask, secondTask];

    const result = await store.updateTask(firstTask.id, {
      title: 'Updated task',
      status: 'in-progress',
    });

    expect(result).toBe(true);
    expect(store.tasks).toEqual([updatedTask, secondTask]);
    expect(store.error).toBeNull();
  });

  it('deletes a task from the list', async () => {
    tasksApiMock.delete.mockResolvedValue(undefined);
    const store = useTasksStore();
    store.tasks = [firstTask, secondTask];

    const result = await store.deleteTask(firstTask.id);

    expect(result).toBe(true);
    expect(store.tasks).toEqual([secondTask]);
    expect(store.error).toBeNull();
  });

  it('returns tasks by status', () => {
    const store = useTasksStore();
    store.tasks = [firstTask, secondTask];

    expect(store.getTaskByStatus('todo')).toEqual([firstTask]);
    expect(store.getTaskByStatus('done')).toEqual([secondTask]);
    expect(store.getTaskByStatus('in-progress')).toEqual([]);
  });
});
