import { clsx,type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs:ClassValue[]){return twMerge(clsx(inputs));}
export function labelStatus(v?:string){return ({CRITICO:'Critico',INICIAL:'Inicial',DESENVOLVIMENTO:'Em desenvolvimento',ESTRUTURADO:'Estruturado',AVANCADO:'Avancado',OPEN:'Aberto',ANSWERED:'Respondido',UNDER_REVIEW:'Em analise',REVIEWED:'Revisado'} as any)[v||'']||v||'-';}
