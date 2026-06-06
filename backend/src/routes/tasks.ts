import { Response, Router } from "express";

import { authMiddleware } from "../middleware/auth";
import { DEFAULT_TASK_STATUS, isValidTaskStatus } from "../constants/tasks";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
} from "../constants/http";
import { type AuthRequest, type Task } from "../types/types";

const router = Router();

let tasks: Task[] = [];
let nextTaskId = 1;

function parseTaskId(idParam: string | string[] | undefined): number | null {
  if (Array.isArray(idParam) || !idParam) {
    return null;
  }

  const id = parseInt(idParam, 10);
  return Number.isNaN(id) ? null : id;
}

function findUserTask(taskId: number, userId: number): Task | undefined {
  return tasks.find((task) => task.id === taskId && task.userId === userId);
}

router.use(authMiddleware);

router.get("/", (req: AuthRequest, res: Response) => {
  const userTasks = tasks.filter((task) => task.userId === req.userId);
  res.json(userTasks);
});

router.post("/", (req: AuthRequest, res: Response) => {
  const { title, status = DEFAULT_TASK_STATUS } = req.body;

  if (!title) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Title is required" });
  }
  if (status !== undefined && !isValidTaskStatus(status)) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid task status" });
  }

  const newTask: Task = {
    id: nextTaskId++,
    userId: req.userId!,
    title,
    status,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  res.status(HTTP_CREATED).json(newTask);
});

router.put("/:id", (req: AuthRequest, res: Response) => {
  const taskId = parseTaskId(req.params.id);
  if (taskId === null) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid task id" });
  }

  const { title, status } = req.body;
  if (status !== undefined && !isValidTaskStatus(status)) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid task status" });
  }

  const task = findUserTask(taskId, req.userId!);
  if (!task) {
    return res.status(HTTP_NOT_FOUND).json({ error: "Task not found" });
  }

  if (title !== undefined) {
    task.title = title;
  }
  if (status !== undefined) {
    task.status = status;
  }

  res.json(task);
});

router.delete("/:id", (req: AuthRequest, res: Response) => {
  const taskId = parseTaskId(req.params.id);
  if (taskId === null) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid task id" });
  }

  const taskIndex = tasks.findIndex(
    (task) => task.id === taskId && task.userId === req.userId,
  );

  if (taskIndex === -1) {
    return res.status(HTTP_NOT_FOUND).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(HTTP_NO_CONTENT).send();
});

export default router;
