import { Request } from "express";

import { type TaskStatus } from "../constants/tasks";

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

export interface AuthRequest extends Request {
  userId?: number;
}

export type PublicUser = Pick<User, "id" | "email" | "name">;
