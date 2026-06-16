import { defineStore } from 'pinia';
import { ref } from 'vue';

import { authApi } from '@/api/endpoints/auth';
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from '@/constants/auth';
import { type User } from '@/types';
import { type AuthResponse, type LoginData, type RegisterData } from '@/types/auth';
import { extractApiError } from '@/utils/apiError';

function loadStoredUser(): User | null {
  const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(loadStoredUser());
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setAuth = (authData: AuthResponse) => {
    token.value = authData.token;
    user.value = authData.user;
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authData.token);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authData.user));
  };

  const runAuthAction = async (action: () => Promise<AuthResponse>, fallbackError: string) => {
    loading.value = true;
    error.value = null;

    try {
      const authData = await action();
      setAuth(authData);
      return true;
    } catch (err: unknown) {
      error.value = extractApiError(err, fallbackError);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = (data: LoginData) => runAuthAction(() => authApi.login(data), 'Login failed');

  const register = (data: RegisterData) =>
    runAuthAction(() => authApi.register(data), 'Registration failed');

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
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
