import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authApi } from '@/api/endpoints/auth';
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from '@/constants/auth';
import { useAuthStore } from '@/stores/auth';
import { type AuthResponse } from '@/types/auth';

vi.mock('@/api/endpoints/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

const authApiMock = vi.mocked(authApi);

const authResponse: AuthResponse = {
  token: 'token-123',
  user: {
    id: 1,
    email: 'user@example.com',
    name: 'User',
  },
};

function createStorageMock(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear: vi.fn(() => storage.clear()),
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(storage.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
  };
}

describe('auth store', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock());
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('starts with empty auth state', () => {
    const store = useAuthStore();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('stores user and token after successful login', async () => {
    authApiMock.login.mockResolvedValue(authResponse);
    const store = useAuthStore();

    const result = await store.login({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result).toBe(true);
    expect(store.user).toEqual(authResponse.user);
    expect(store.token).toBe(authResponse.token);
    expect(store.error).toBeNull();
    expect(store.isAuthenticated()).toBe(true);
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe(authResponse.token);
    expect(localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBe(JSON.stringify(authResponse.user));
  });

  it('sets error after failed login', async () => {
    authApiMock.login.mockRejectedValue(new Error('Network failed'));
    const store = useAuthStore();

    const result = await store.login({
      email: 'user@example.com',
      password: 'bad-password',
    });

    expect(result).toBe(false);
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.error).toBe('Login failed');
    expect(store.isAuthenticated()).toBe(false);
  });

  it('clears user and token on logout', async () => {
    authApiMock.login.mockResolvedValue(authResponse);
    const store = useAuthStore();
    await store.login({
      email: 'user@example.com',
      password: 'password123',
    });

    store.logout();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
  });
});
