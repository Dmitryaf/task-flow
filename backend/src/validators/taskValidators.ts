import {
  getTrimmedString,
  isRecord,
  type ValidationResult,
} from "./common";
import { isValidTaskStatus, type TaskStatus } from "../constants/tasks";

export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  status?: TaskStatus;
}

export function validateCreateTaskPayload(
  payload: unknown,
): ValidationResult<CreateTaskInput> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid request body" };
  }

  const title = getTrimmedString(payload, "title");
  if (!title) {
    return { ok: false, error: "Title is required" };
  }

  const { status } = payload;
  if (status !== undefined && !isValidTaskStatus(status)) {
    return { ok: false, error: "Invalid task status" };
  }

  return {
    ok: true,
    data: {
      title,
      ...(status !== undefined ? { status } : {}),
    },
  };
}

export function validateUpdateTaskPayload(
  payload: unknown,
): ValidationResult<UpdateTaskInput> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid request body" };
  }

  const data: UpdateTaskInput = {};

  if ("title" in payload) {
    const title = getTrimmedString(payload, "title");
    if (!title) {
      return { ok: false, error: "Title is required" };
    }
    data.title = title;
  }

  if ("status" in payload) {
    const { status } = payload;
    if (!isValidTaskStatus(status)) {
      return { ok: false, error: "Invalid task status" };
    }
    data.status = status;
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, error: "At least one field is required" };
  }

  return { ok: true, data };
}
