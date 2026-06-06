import { type TaskStatus } from '@/types/task';

export const DRAG_DATA_MIME_TYPE = 'text/plain';

export const TASK_COLUMNS: ReadonlyArray<{
  title: string;
  status: TaskStatus;
}> = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Done', status: 'done' },
];
