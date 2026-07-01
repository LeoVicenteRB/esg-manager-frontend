import axios from 'axios';
import { clearSession, getToken, sessionExpiredByInactivity, touchSession } from '@/lib/auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://florescencia-backend.c8wqor.easypanel.host/api',
});

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = getToken();
  if (!token) return config;

  if (sessionExpiredByInactivity()) {
    clearSession();
    window.location.href = '/login?session=expired';
    return Promise.reject(new Error('Sessao expirada por inatividade.'));
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
