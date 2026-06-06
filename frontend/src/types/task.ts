export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  userId: number;
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  status?: TaskStatus;
}
