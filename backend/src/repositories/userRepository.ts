import { type User } from "../types/types";

const users: User[] = [];

interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export function createUser(data: CreateUserData): User {
  const user: User = {
    id: users.length + 1,
    email: data.email,
    name: data.name,
    password: data.password,
  };

  users.push(user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

export function findUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

export function userExistsByEmail(email: string): boolean {
  return findUserByEmail(email) !== undefined;
}

export function resetUsersRepository(): void {
  users.length = 0;
}
