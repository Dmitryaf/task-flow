import axios from 'axios';

interface ApiErrorResponse {
  error?: unknown;
}

export function extractApiError(err: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    const responseError = err.response?.data?.error;
    if (typeof responseError === 'string') {
      return responseError;
    }
  }

  return fallbackMessage;
}
