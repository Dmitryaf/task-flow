import { DEFAULT_TASK_STATUS } from "../constants/tasks";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../constants/http";
import {
  createTask,
  deleteTask,
  getTasksByUserId,
  updateTask,
} from "../repositories/taskRepository";
import { type Task } from "../types/types";
import {
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../validators/taskValidators";

type TaskServiceResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: typeof HTTP_BAD_REQUEST | typeof HTTP_NOT_FOUND; error: string };

export function getUserTasks(userId: number): Task[] {
  return getTasksByUserId(userId);
}

export function createUserTask(
  userId: number,
  data: CreateTaskInput,
): TaskServiceResult<Task> {
  const { title } = data;
  const status = data.status ?? DEFAULT_TASK_STATUS;

  return {
    ok: true,
    status: HTTP_CREATED,
    data: createTask({
      userId,
      title,
      status,
    }),
  };
}

export function updateUserTask(
  userId: number,
  taskId: number,
  data: UpdateTaskInput,
): TaskServiceResult<Task> {
  const { title, status } = data;

  const task = updateTask(taskId, userId, {
    title,
    status,
  });
  if (!task) {
    return {
      ok: false,
      status: HTTP_NOT_FOUND,
      error: "Task not found",
    };
  }

  return {
    ok: true,
    status: HTTP_OK,
    data: task,
  };
}

export function deleteUserTask(
  userId: number,
  taskId: number,
): TaskServiceResult<null> {
  const isDeleted = deleteTask(taskId, userId);
  if (!isDeleted) {
    return {
      ok: false,
      status: HTTP_NOT_FOUND,
      error: "Task not found",
    };
  }

  return {
    ok: true,
    status: HTTP_NO_CONTENT,
    data: null,
  };
}
