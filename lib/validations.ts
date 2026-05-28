import { z } from 'zod';

const required = 'Campo obrigatorio.';
const cnpj = z.string().regex(/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/, 'CNPJ invalido.');
const phone = z.string().optional().refine(
  (value) => !value || /^(\(\d{2}\)\s?\d{4,5}-\d{4}|\d{10,11})$/.test(value),
  'Telefone invalido.',
);

export const loginSchema = z.object({
  email: z.string().email('E-mail invalido.'),
  password: z.string().min(1, 'Senha obrigatoria.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail invalido.'),
});

export const userSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto.').max(120),
  email: z.string().email('E-mail invalido.'),
  password: z.string().min(8, 'Use pelo menos 8 caracteres.').regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Use letras e numeros.'),
  role: z.enum(['ADMIN', 'CONSULTANT', 'SPECIALIST', 'CLIENT_VIEWER']),
});

export const clientSchema = z.object({
  companyName: z.string().trim().min(2, required).max(160),
  tradeName: z.string().trim().max(160).optional().or(z.literal('')),
  cnpj,
  sector: z.string().trim().min(2, required).max(100),
  companySize: z.enum(['MEI', 'MICRO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']),
  employeesCount: z.coerce.number().int().min(0).max(1000000),
  city: z.string().trim().min(2, required).max(100),
  state: z.string().regex(/^[A-Z]{2}$/, 'Use a UF com 2 letras.'),
  responsibleName: z.string().trim().min(2, required).max(120),
  responsibleEmail: z.string().email('E-mail invalido.'),
  responsiblePhone: phone,
});

export const publicCompanySchema = clientSchema.pick({
  companyName: true,
  cnpj: true,
  sector: true,
  companySize: true,
  responsibleName: true,
  responsibleEmail: true,
  responsiblePhone: true,
});

export const specialistReviewSchema = z.object({
  formId: z.string().min(1, 'Selecione um formulario.'),
  clientId: z.string().min(1, 'Formulario sem cliente vinculado.'),
  environmentalDiagnosis: z.string().trim().min(5, 'Informe um diagnostico.').max(3000),
  socialDiagnosis: z.string().trim().min(5, 'Informe um diagnostico.').max(3000),
  governanceDiagnosis: z.string().trim().min(5, 'Informe um diagnostico.').max(3000),
  risks: z.string().trim().min(5, 'Informe os riscos.').max(3000),
  evidences: z.string().trim().min(5, 'Informe as evidencias.').max(3000),
  recommendations: z.string().trim().min(5, 'Informe recomendacoes.').max(3000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  suggestedDeadline: z.string().optional().or(z.literal('')),
  adjustedScore: z.coerce.number().min(0).max(100),
  finalNotes: z.string().max(3000).optional().or(z.literal('')),
});
