import type { User } from ".";

export interface AuthRes {
    token: string;
    user: User
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}