import axios from 'axios';

import { DEFAULT_API_BASE_URL } from '@/constants/api';
import { AUTH_BEARER_PREFIX, AUTH_TOKEN_STORAGE_KEY } from '@/constants/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `${AUTH_BEARER_PREFIX}${token}`;
  }
  return config;
});

export default api;
