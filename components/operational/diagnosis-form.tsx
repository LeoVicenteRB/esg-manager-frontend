'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, ClipboardCheck, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import Link from 'next/link';

type Question = {
  id: string;
  number: number;
  section: string;
  text: string;
  type: 'single' | 'multiple' | 'consent';
  required: boolean;
  maxSelections?: number;
  options: { label: string; score?: number }[];
};

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const schema = z.object({
  fullName: z.string().min(3, 'Informe o nome completo.'),
  companyName: z.string().min(2, 'Informe a empresa.'),
  cnpj: z.string().regex(/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, 'Informe um CNPJ válido.'),
  sector: z.string().min(2, 'Informe o setor.'),
  companySize: z.string().min(1, 'Informe o porte.'),
  employeesCount: z.coerce.number().min(0).optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  professionalEmail: z.string().email('Informe um e-mail válido.'),
  whatsapp: z.string().min(10, 'Informe o WhatsApp.'),
  respondentRole: z.string().min(2, 'Informe o cargo ou função.'),
  password: z.string().regex(strongPassword, 'Use 8+ caracteres com maiúscula, minúscula, número e caractere especial.'),
  passwordConfirmation: z.string().min(1, 'Confirme a senha.'),
}).refine((data) => data.password === data.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'As senhas não conferem.',
});

type FormValues = z.infer<typeof schema>;
type AnswerState = Record<string, string | string[]>;

const companySizes = [
  ['MEI', 'MEI'],
  ['MICRO', 'Micro'],
  ['SMALL', 'Pequena'],
  ['MEDIUM', 'Média'],
  ['LARGE', 'Grande'],
  ['ENTERPRISE', 'Corporativo'],
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function maskCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function BackToSiteButton({ token, className = '' }: { token?: string; className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVisible(!token && params.get('origem') === 'site');
  }, [token]);

  if (!visible) return null;

  return (
    <div className={className}>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-950/15 bg-white px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-50"
      >
        Voltar ao site
      </Link>
    </div>
  );
}

export function OperationalDiagnosisForm({ token }: { token?: string }) {
const [answers, setAnswers] = useState<AnswerState>({});
  const [message, setMessage] = useState('');
const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { companySize: 'MEDIUM', employeesCount: 0, city: '', state: '' },
  });

  const definition = useQuery({
    queryKey: ['operational-form', token],
    queryFn: () => api.get(token ? `/forms/public/${token}` : '/public/forms/operational-diagnosis').then((res) => res.data),
  });

  const questions: Question[] = definition.data?.questions ?? [];
  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((Object.keys(answers).filter((key) => {
      const value = answers[key];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }).length / questions.length) * 100);
  }, [answers, questions.length]);

  const submit = useMutation({
    mutationFn: (payload: any) =>
      api.post(token ? `/forms/public/${token}/submit` : '/public/forms/operational-diagnosis/submit', payload).then((res) => res.data),
  });

  function choose(question: Question, option: string) {
    setMessage('');
    if (question.type === 'multiple') {
      setAnswers((current) => {
        const selected = Array.isArray(current[question.id]) ? [...(current[question.id] as string[])] : [];
        const exists = selected.includes(option);
        const next = exists ? selected.filter((item) => item !== option) : [...selected, option];
        if (!exists && question.maxSelections && selected.length >= question.maxSelections) {
          setMessage(`Escolha no máximo ${question.maxSelections} opções nesta pergunta.`);
          return current;
        }
        return { ...current, [question.id]: next };
      });
      return;
    }
    setAnswers((current) => ({ ...current, [question.id]: option }));
  }

  function buildAnswers() {
    return Object.entries(answers)
      .filter(([questionId]) => questionId !== 'operational-lgpd')
      .map(([questionId, value]) => (Array.isArray(value) ? { questionId, answers: value } : { questionId, answer: value }));
  }

  function onSubmit(values: FormValues) {
    const missing = questions.find((question) => {
      const value = answers[question.id];
      return question.required && (!value || (Array.isArray(value) && value.length === 0));
    });
    if (missing) {
      setMessage(`Responda à pergunta ${missing.number} antes de enviar.`);
      return;
    }
    if (answers['operational-lgpd'] !== 'Sim, concordo') {
      setMessage('Para gerar o diagnóstico, é necessário concordar com o uso dos dados para a finalidade descrita.');
      return;
    }
    submit.mutate({ ...values, answers: buildAnswers(), lgpdConsent: answers['operational-lgpd'] });
  }

  if (submit.data) {
    return (
      <main className="min-h-screen bg-[#f7faf9] px-4 py-8 sm:px-6">

                <BackToSiteButton token={token} className="mx-auto mb-4 max-w-2xl" />
<Card className="mx-auto max-w-2xl p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-teal-700" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Diagnóstico enviado com sucesso</h1>
          <p className="mt-3 text-slate-600">Você já pode entrar na plataforma com o e-mail profissional e a senha criada.</p>
          <div className="mt-6 rounded-md bg-teal-50 p-4 text-left text-sm text-teal-950">
            <strong>Resultado preliminar:</strong> {submit.data.generalScore?.toFixed?.(1) ?? submit.data.generalScore} / 5.0 - {submit.data.maturityLabel}
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf9] px-4 py-6 sm:px-6 lg:py-10">
      <section className="mx-auto max-w-5xl">

                <BackToSiteButton token={token} className="mb-5" />
<div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">
            <ClipboardCheck size={16} />
            Diagnóstico gratuito
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            Diagnóstico de Eficiência Operacional para Feiras de Negócios e Eventos Corporativos
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            Identifique perdas financeiras, falhas operacionais, riscos e oportunidades de melhoria na montagem, execução e desmontagem de estandes e eventos corporativos.
          </p>
        </div>

        <div className="sticky top-0 z-10 mb-5 rounded-md border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>Progresso do diagnóstico</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-teal-700 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950">Dados para cadastro e contato</h2>
            <p className="mt-1 text-sm text-slate-500">Esses dados alimentam o cadastro interno da empresa e criam o acesso do cliente visualizador.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Nome completo" error={form.formState.errors.fullName?.message}><Input {...form.register('fullName')} /></Field>
              <Field label="Nome da empresa" error={form.formState.errors.companyName?.message}><Input {...form.register('companyName')} /></Field>
              <Field label="CNPJ" error={form.formState.errors.cnpj?.message}>
                <Input value={form.watch('cnpj') ?? ''} onChange={(event) => form.setValue('cnpj', maskCnpj(event.target.value), { shouldValidate: true })} />
              </Field>
              <Field label="Setor" error={form.formState.errors.sector?.message}><Input {...form.register('sector')} /></Field>
              <Field label="Porte" error={form.formState.errors.companySize?.message}>
                <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" {...form.register('companySize')}>
                  {companySizes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Funcionários"><Input type="number" min={0} {...form.register('employeesCount')} /></Field>
              <Field label="Cidade"><Input {...form.register('city')} /></Field>
              <Field label="UF"><Input value={form.watch('state') ?? ''} onChange={(event) => form.setValue('state', event.target.value.toUpperCase().slice(0, 2))} /></Field>
              <Field label="E-mail profissional" error={form.formState.errors.professionalEmail?.message}><Input {...form.register('professionalEmail')} /></Field>
              <Field label="Telefone (WhatsApp)" error={form.formState.errors.whatsapp?.message}>
                <Input value={form.watch('whatsapp') ?? ''} onChange={(event) => form.setValue('whatsapp', maskPhone(event.target.value), { shouldValidate: true })} />
              </Field>
              <Field label="Cargo/Função" error={form.formState.errors.respondentRole?.message}><Input {...form.register('respondentRole')} /></Field>
              <Field label="Senha de acesso" error={form.formState.errors.password?.message}>
                <Input type="password" autoComplete="new-password" {...form.register('password')} />
                <span className="mt-1 block text-xs text-slate-500">Mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial.</span>
              </Field>
              <Field label="Confirmar senha" error={form.formState.errors.passwordConfirmation?.message}>
                <Input type="password" autoComplete="new-password" {...form.register('passwordConfirmation')} />
              </Field>
            </div>
          </Card>

          {definition.isLoading ? (
            <Card className="grid min-h-40 place-items-center p-8 text-slate-500">
              <Loader2 className="mb-2 animate-spin" />
              Carregando perguntas...
            </Card>
          ) : (
            questions.map((question) => (
              <Card key={question.id} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">{question.section}</span>
                  {question.maxSelections ? <span className="text-xs text-slate-500">Escolha até {question.maxSelections}</span> : null}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-950 sm:text-lg">{question.number}. {question.text}</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const value = answers[question.id];
                    const active = Array.isArray(value) ? value.includes(option.label) : value === option.label;
                    return (
                      <button
                        type="button"
                        key={option.label}
                        onClick={() => choose(question, option.label)}
                        className={`rounded-md border px-3 py-3 text-left text-sm font-medium transition ${
                          active ? 'border-teal-700 bg-teal-50 text-teal-950' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {question.id === 'operational-lgpd' ? <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">{definition.data?.lgpdText}</p> : null}
              </Card>
            ))
          )}

          {message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p> : null}
          {submit.error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">Não foi possível enviar. Revise os campos obrigatórios.</p> : null}

          <Button disabled={submit.isPending || definition.isLoading} className="w-full sm:w-auto">
            {submit.isPending ? 'Enviando...' : 'Enviar diagnóstico'}
          </Button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
