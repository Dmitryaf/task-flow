export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const DEFAULT_TASK_STATUS: TaskStatus = "todo";

export function isValidTaskStatus(status: unknown): status is TaskStatus {
  return (
    typeof status === "string" &&
    TASK_STATUSES.includes(status as TaskStatus)
  );
}
