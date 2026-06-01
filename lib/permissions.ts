import { getUser } from '@/lib/auth';

export const internalRoles = ['ADMIN', 'CONSULTANT', 'SPECIALIST'];
export const adminRoles = ['ADMIN'];
export const clientRoles = ['CLIENT_VIEWER'];

export function hasRole(allowed: string[]) {
  const user = getUser();
  return Boolean(user && allowed.includes(user.role));
}

export function defaultPathForRole(role?: string) {
  if (role === 'CLIENT_VIEWER') return '/my-diagnoses';
  return '/dashboard';
}

export function allowedForPath(pathname: string, role?: string) {
  if (!role) return false;
  if (pathname.startsWith('/my-diagnoses')) return role === 'CLIENT_VIEWER';
  if (pathname.startsWith('/users')) return role === 'ADMIN';
  if (pathname.startsWith('/specialist')) return role === 'ADMIN' || role === 'SPECIALIST';
  if (pathname.startsWith('/clients')) return role === 'ADMIN' || role === 'CONSULTANT' || role === 'SPECIALIST';
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/forms') || pathname.startsWith('/reports')) {
    return role === 'ADMIN' || role === 'CONSULTANT' || role === 'SPECIALIST';
  }
  return true;
}
