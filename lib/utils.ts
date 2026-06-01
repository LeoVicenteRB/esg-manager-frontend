import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function labelStatus(value?: string) {
  return ({
    CRITICO: 'Crítico',
    INICIAL: 'Inicial',
    DESENVOLVIMENTO: 'Em desenvolvimento',
    ESTRUTURADO: 'Estruturado',
    AVANCADO: 'Avançado',
    OPEN: 'Aberto',
    ANSWERED: 'Respondido',
    UNDER_REVIEW: 'Em análise',
    REVIEWED: 'Revisado',
  } as Record<string, string>)[value || ''] || value || '-';
}

export function labelRole(value?: string) {
  return ({
    ADMIN: 'Administrador',
    CONSULTANT: 'Consultor',
    SPECIALIST: 'Especialista',
    CLIENT_VIEWER: 'Cliente visualizador',
  } as Record<string, string>)[value || ''] || value || '-';
}

export function labelLeadTemperature(value?: string) {
  return ({
    hot: 'Quente',
    warm: 'Morna',
    cold: 'Fria',
  } as Record<string, string>)[value || ''] || value || '-';
}

export function labelUrgency(value?: string) {
  return ({
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  } as Record<string, string>)[value || ''] || value || '-';
}
