import { type AuthRes, type LoginData, type RegisterData } from '@/types/auth';
import api from '..';

export const authApi = {
  login: (data: LoginData) => api.post<AuthRes>('/auth/login', data),
  register: (data: RegisterData) => api.post<AuthRes>('/auth/register', data),
};
