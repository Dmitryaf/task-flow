import { type Task } from "../types/types";

let tasks: Task[] = [];
let nextTaskId = 1;

interface CreateTaskData {
  userId: number;
  title: string;
  status: Task["status"];
}

interface UpdateTaskData {
  title?: string;
  status?: Task["status"];
}

export function createTask(data: CreateTaskData): Task {
  const task: Task = {
    id: nextTaskId++,
    userId: data.userId,
    title: data.title,
    status: data.status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  return task;
}

export function getTasksByUserId(userId: number): Task[] {
  return tasks.filter((task) => task.userId === userId);
}

export function findTaskById(id: number): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function updateTask(
  id: number,
  userId: number,
  data: UpdateTaskData,
): Task | null {
  const task = findTaskById(id);
  if (!task || task.userId !== userId) {
    return null;
  }

  if (data.title !== undefined) {
    task.title = data.title;
  }
  if (data.status !== undefined) {
    task.status = data.status;
  }

  return task;
}

export function deleteTask(id: number, userId: number): boolean {
  const taskIndex = tasks.findIndex(
    (task) => task.id === id && task.userId === userId,
  );

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}
