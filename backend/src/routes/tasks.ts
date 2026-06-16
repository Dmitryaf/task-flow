import { Response, Router } from "express";

import { authMiddleware } from "../middleware/auth";
import { HTTP_BAD_REQUEST } from "../constants/http";
import * as taskService from "../services/taskService";
import { type AuthRequest } from "../types/types";
import {
  validateCreateTaskPayload,
  validateUpdateTaskPayload,
} from "../validators/taskValidators";

const router = Router();

function parseTaskId(idParam: string | string[] | undefined): number | null {
  if (Array.isArray(idParam) || !idParam) {
    return null;
  }

  const id = parseInt(idParam, 10);
  return Number.isNaN(id) ? null : id;
}

router.use(authMiddleware);

router.get("/", (req: AuthRequest, res: Response) => {
  const userTasks = taskService.getUserTasks(req.userId!);
  res.json(userTasks);
});

router.post("/", (req: AuthRequest, res: Response) => {
  const validation = validateCreateTaskPayload(req.body);
  if (!validation.ok) {
    return res.status(HTTP_BAD_REQUEST).json({ error: validation.error });
  }

  const result = taskService.createUserTask(req.userId!, validation.data);

  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json(result.data);
});

router.put("/:id", (req: AuthRequest, res: Response) => {
  const taskId = parseTaskId(req.params.id);
  if (taskId === null) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid task id" });
  }

  const validation = validateUpdateTaskPayload(req.body);
  if (!validation.ok) {
    return res.status(HTTP_BAD_REQUEST).json({ error: validation.error });
  }

  const result = taskService.updateUserTask(req.userId!, taskId, validation.data);
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json(result.data);
});

router.delete("/:id", (req: AuthRequest, res: Response) => {
  const taskId = parseTaskId(req.params.id);
  if (taskId === null) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid task id" });
  }

  const result = taskService.deleteUserTask(req.userId!, taskId);
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).send();
});

export default router;
