'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

type Question = {
  id: string;
  questionText: string;
  answerType: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT';
  options: string[];
  required: boolean;
  order: number;
};

type AnswerState = Record<string, string | string[]>;
type Registration = {
  fullName: string;
  companyName: string;
  cnpj: string;
  sector: string;
  companySize: string;
  employeesCount: string;
  city: string;
  state: string;
  professionalEmail: string;
  whatsapp: string;
  respondentRole: string;
  password: string;
  passwordConfirmation: string;
};

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
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

export function IndividualPublicForm({ slug }: { slug: string }) {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [message, setMessage] = useState('');
  const [registration, setRegistration] = useState<Registration>({
    fullName: '',
    companyName: '',
    cnpj: '',
    sector: '',
    companySize: 'MEDIUM',
    employeesCount: '0',
    city: '',
    state: '',
    professionalEmail: '',
    whatsapp: '',
    respondentRole: '',
    password: '',
    passwordConfirmation: '',
  });

  const form = useQuery({
    queryKey: ['individual-public-form', slug],
    queryFn: () => api.get(`/public/individual-diagnostics/${slug}`).then((res) => res.data),
  });

  useEffect(() => {
    if (form.data?.clientName && !registration.companyName) {
      setRegistration((current) => ({ ...current, companyName: form.data.clientName }));
    }
  }, [form.data?.clientName, registration.companyName]);

  const submit = useMutation({
    mutationFn: (payload: any) => api.post(`/public/individual-diagnostics/${slug}/submit`, payload).then((res) => res.data),
  });

  const questions: Question[] = form.data?.questions ?? [];

  function updateRegistration(key: keyof Registration, value: string) {
    setMessage('');
    setRegistration((current) => ({ ...current, [key]: value }));
  }

  function setAnswer(questionId: string, value: string | string[]) {
    setMessage('');
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function toggleMulti(questionId: string, option: string, checked: boolean) {
    const current = Array.isArray(answers[questionId]) ? (answers[questionId] as string[]) : [];
    setAnswer(questionId, checked ? [...current, option] : current.filter((item) => item !== option));
  }

  function validateRegistration() {
    const required: [keyof Registration, string][] = [
      ['fullName', 'Informe o nome completo.'],
      ['companyName', 'Informe o nome da empresa.'],
      ['cnpj', 'Informe o CNPJ.'],
      ['sector', 'Informe o setor.'],
      ['professionalEmail', 'Informe o e-mail profissional.'],
      ['whatsapp', 'Informe o telefone/WhatsApp.'],
      ['respondentRole', 'Informe o cargo ou função.'],
    ];
    const missing = required.find(([key]) => !String(registration[key] ?? '').trim());
    if (missing) return missing[1];
    if (onlyDigits(registration.cnpj).length !== 14) return 'Informe um CNPJ válido.';
    if (!registration.professionalEmail.includes('@')) return 'Informe um e-mail válido.';
    if (!strongPassword.test(registration.password)) return 'Use uma senha forte com 8+ caracteres, maiúscula, minúscula, número e caractere especial.';
    if (registration.password !== registration.passwordConfirmation) return 'As senhas não conferem.';
    return '';
  }

  function send() {
    const registrationError = validateRegistration();
    if (registrationError) {
      setMessage(registrationError);
      return;
    }

    const missing = questions.find((question) => {
      const value = answers[question.id];
      return question.required && (!value || (Array.isArray(value) && value.length === 0));
    });
    if (missing) {
      setMessage(`Responda: ${missing.questionText}`);
      return;
    }

    submit.mutate({
      ...registration,
      employeesCount: Number(registration.employeesCount || 0),
      answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
    });
  }

  if (submit.data) {
    return (
      <main className="min-h-screen bg-[#f7faf9] px-4 py-8">
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-teal-700" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Formulário enviado com sucesso</h1>
          <p className="mt-2 text-slate-600">Obrigado. Suas respostas foram registradas e o relatório foi enviado para análise.</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf9] px-4 py-6 sm:px-6 lg:py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">Formulário individual</span>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Diagnóstico individual - {form.data?.clientName ?? ''}</h1>
          <p className="mt-2 text-slate-600">Preencha seus dados de acesso e responda às perguntas abaixo para concluir o diagnóstico solicitado.</p>
        </div>

        {form.isLoading ? (
          <Card className="grid min-h-40 place-items-center p-8 text-slate-500">
            <Loader2 className="mb-2 animate-spin" />
            Carregando formulário...
          </Card>
        ) : null}

        {form.error ? <p className="rounded-md bg-red-50 p-4 text-red-700">Formulário individual não encontrado.</p> : null}

        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950">Dados para cadastro e contato</h2>
            <p className="mt-1 text-sm text-slate-500">Esses dados alimentam o cadastro interno da empresa e criam o acesso do cliente visualizador.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Nome completo"><Input value={registration.fullName} onChange={(event) => updateRegistration('fullName', event.target.value)} /></Field>
              <Field label="Nome da empresa"><Input value={registration.companyName} onChange={(event) => updateRegistration('companyName', event.target.value)} /></Field>
              <Field label="CNPJ"><Input value={registration.cnpj} onChange={(event) => updateRegistration('cnpj', maskCnpj(event.target.value))} /></Field>
              <Field label="Setor"><Input value={registration.sector} onChange={(event) => updateRegistration('sector', event.target.value)} /></Field>
              <Field label="Porte">
                <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={registration.companySize} onChange={(event) => updateRegistration('companySize', event.target.value)}>
                  {companySizes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Funcionários"><Input type="number" min={0} value={registration.employeesCount} onChange={(event) => updateRegistration('employeesCount', event.target.value)} /></Field>
              <Field label="Cidade"><Input value={registration.city} onChange={(event) => updateRegistration('city', event.target.value)} /></Field>
              <Field label="UF"><Input value={registration.state} onChange={(event) => updateRegistration('state', event.target.value.toUpperCase().slice(0, 2))} /></Field>
              <Field label="E-mail profissional"><Input value={registration.professionalEmail} onChange={(event) => updateRegistration('professionalEmail', event.target.value)} /></Field>
              <Field label="Telefone (WhatsApp)"><Input value={registration.whatsapp} onChange={(event) => updateRegistration('whatsapp', maskPhone(event.target.value))} /></Field>
              <Field label="Cargo/Função"><Input value={registration.respondentRole} onChange={(event) => updateRegistration('respondentRole', event.target.value)} /></Field>
              <Field label="Senha de acesso">
                <Input type="password" autoComplete="new-password" value={registration.password} onChange={(event) => updateRegistration('password', event.target.value)} />
                <span className="mt-1 block text-xs text-slate-500">Mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial.</span>
              </Field>
              <Field label="Confirmar senha"><Input type="password" autoComplete="new-password" value={registration.passwordConfirmation} onChange={(event) => updateRegistration('passwordConfirmation', event.target.value)} /></Field>
            </div>
          </Card>

          {questions.map((question, index) => (
            <Card key={question.id} className="p-5">
              <h2 className="text-base font-semibold text-slate-950">
                {index + 1}. {question.questionText}
                {question.required ? <span className="text-red-600"> *</span> : null}
              </h2>
              <div className="mt-4">
                {question.answerType === 'TEXT' ? <textarea className="min-h-28 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700" value={(answers[question.id] as string) ?? ''} onChange={(event) => setAnswer(question.id, event.target.value)} /> : null}
                {question.answerType === 'NUMBER' ? <Input type="number" value={(answers[question.id] as string) ?? ''} onChange={(event) => setAnswer(question.id, event.target.value)} /> : null}
                {question.answerType === 'SELECT' ? (
                  <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-700" value={(answers[question.id] as string) ?? ''} onChange={(event) => setAnswer(question.id, event.target.value)}>
                    <option value="">Selecione</option>
                    {question.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : null}
                {question.answerType === 'MULTI_SELECT' ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const selected = Array.isArray(answers[question.id]) && (answers[question.id] as string[]).includes(option);
                      return (
                        <label key={option} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                          <input type="checkbox" checked={selected} onChange={(event) => toggleMulti(question.id, option, event.target.checked)} />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>

        {message ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p> : null}
        {submit.error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">Não foi possível enviar. Revise as respostas obrigatórias.</p> : null}

        {questions.length ? (
          <Button type="button" onClick={send} disabled={submit.isPending} className="mt-5 w-full sm:w-auto">
            {submit.isPending ? 'Enviando...' : 'Enviar respostas'}
          </Button>
        ) : null}
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
