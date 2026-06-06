import { defineStore } from 'pinia';
import { ref } from 'vue';

import { type User } from '@/types';
import { type AuthRes, type LoginData, type RegisterData } from '@/types/auth';
import api from '@/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setAuth = (authData: AuthRes) => {
    token.value = authData.token;
    user.value = authData.user;
    localStorage.setItem('token', authData.token);
  };

  const login = async (data: LoginData) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.post<AuthRes>('/auth/login', data);
      setAuth(res.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.post<AuthRes>('/auth/register', data);
      setAuth(res.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => !!token.value;

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
});
