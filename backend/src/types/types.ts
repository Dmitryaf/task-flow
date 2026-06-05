import { Request } from "express"

export interface User {
    id: number
    email: string
    name: string
    password: string
}

export interface Task {
    id: number
    userId: number
    title: string
    status: 'todo' | 'in-progress' | 'done'
    createdAt: string
}

export interface AuthRequest extends Request {
    userId?: number
}