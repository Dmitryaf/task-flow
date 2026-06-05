export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Task {
    id: number;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    userId: number;
    createdAt: string;
}

