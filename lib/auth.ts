export type SessionUser = { id: string; name: string; email: string; role: string; clientId?: string | null };

const TOKEN_KEY = 'esg.token';
const USER_KEY = 'esg.user';
const LAST_ACTIVITY_KEY = 'esg.lastActivityAt';
const LAST_RENEW_KEY = 'esg.lastRenewedAt';

export const SESSION_IDLE_LIMIT_MS = 60 * 60 * 1000;
export const SESSION_RENEW_INTERVAL_MS = 15 * 60 * 1000;

function now() {
  return Date.now();
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function touchSession() {
  if (typeof window === 'undefined' || !getToken()) return;
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now()));
}

export function getLastActivityAt() {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
}

export function sessionExpiredByInactivity() {
  const token = getToken();
  if (!token) return false;

  const lastActivity = getLastActivityAt();
  if (!lastActivity) return false;

  return now() - lastActivity > SESSION_IDLE_LIMIT_MS;
}

export function shouldRenewSession() {
  if (typeof window === 'undefined' || !getToken()) return false;

  const lastRenew = Number(localStorage.getItem(LAST_RENEW_KEY) || 0);
  return now() - lastRenew > SESSION_RENEW_INTERVAL_MS;
}

export function saveSession(token: string, user: SessionUser) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now()));
  localStorage.setItem(LAST_RENEW_KEY, String(now()));
}

export function renewStoredSession(token: string, user?: SessionUser) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LAST_RENEW_KEY, String(now()));
  touchSession();
}

export function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  localStorage.removeItem(LAST_RENEW_KEY);
}

export function logout(redirectTo = '/login') {
  clearSession();
  if (typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
}
