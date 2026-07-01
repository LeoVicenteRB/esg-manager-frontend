import axios from 'axios';
import { clearSession, getToken, sessionExpiredByInactivity, touchSession } from '@/lib/auth';

function resolveApiUrl() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:3333/api';
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
}

export const api = axios.create({ baseURL: resolveApiUrl() });

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = getToken();
  if (!token) return config;

  if (sessionExpiredByInactivity()) {
    clearSession();
    window.location.href = '/login?session=expired';
    return Promise.reject(new Error('Sessão expirada por inatividade.'));
  }

  touchSession();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401 && getToken()) {
      clearSession();
      window.location.href = '/login?session=expired';
    }

    return Promise.reject(error);
  },
);
