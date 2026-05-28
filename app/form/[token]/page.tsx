'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { maskCnpj, maskPhone } from '@/lib/masks';
import { publicCompanySchema } from '@/lib/validations';

const options = [['Nao possui', 0], ['Em planejamento', 25], ['Parcialmente implementado', 50], ['Implementado', 75], ['Implementado e monitorado', 100]] as const;
function ErrorText({ message }: { message?: unknown }) { return message ? <small className="text-red-600">{String(message)}</small> : null; }

export default function PublicForm() {
  const { token } = useParams<{ token: string }>();
  const company = useForm<any>({ resolver: zodResolver(publicCompanySchema), defaultValues: { companySize: 'MEDIUM' } });
  const [answers, setAnswers] = useState<Record<string, { answer: string; score: number }>>({});
  const { data } = useQuery({ queryKey: ['public-form', token], queryFn: () => api.get(`/forms/public/${token}`).then((r) => r.data) });
  const submit = useMutation({ mutationFn: (payload: any) => api.post(`/forms/public/${token}/submit`, payload).then((r) => r.data) });
  const errors = company.formState.errors;
  async function send() { const valid = await company.trigger(); if (!valid) return; submit.mutate({ ...company.getValues(), answers: Object.entries(answers).map(([questionId, v]) => ({ questionId, ...v })) }); }
  if (submit.data) return <main className="grid min-h-screen place-items-center p-4 sm:p-6"><Card className="max-w-lg p-6 text-center sm:p-8"><h1 className="text-2xl font-semibold">Formulario enviado</h1><p className="mt-3 text-slate-600">Score ESG geral: {Math.round(submit.data.generalScore)} - {submit.data.classification}</p></Card></main>;
  return (
    <main className="mx-auto max-w-4xl space-y-4 p-3 sm:space-y-5 sm:p-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">Diagnostico ESG</h1>
      <Card className="p-4 sm:p-5">
        <h2 className="font-semibold">Dados da empresa</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label><Input placeholder="Nome da empresa" {...company.register('companyName')}/><ErrorText message={errors.companyName?.message}/></label>
          <label><Input placeholder="CNPJ" {...company.register('cnpj', { onChange: (e) => company.setValue('cnpj', maskCnpj(e.target.value), { shouldValidate: true }) })}/><ErrorText message={errors.cnpj?.message}/></label>
          <label><Input placeholder="Setor" {...company.register('sector')}/><ErrorText message={errors.sector?.message}/></label>
          <label><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" {...company.register('companySize')}><option value="MEI">MEI</option><option value="MICRO">Micro</option><option value="SMALL">Pequeno</option><option value="MEDIUM">Medio</option><option value="LARGE">Grande</option><option value="ENTERPRISE">Enterprise</option></select><ErrorText message={errors.companySize?.message}/></label>
          <label><Input placeholder="Responsavel" {...company.register('responsibleName')}/><ErrorText message={errors.responsibleName?.message}/></label>
          <label><Input placeholder="E-mail" {...company.register('responsibleEmail')}/><ErrorText message={errors.responsibleEmail?.message}/></label>
          <label><Input placeholder="Telefone" {...company.register('responsiblePhone', { onChange: (e) => company.setValue('responsiblePhone', maskPhone(e.target.value), { shouldValidate: true }) })}/><ErrorText message={errors.responsiblePhone?.message}/></label>
        </div>
      </Card>
      {data?.questions?.map((q: any) => <Card key={q.id} className="p-4 sm:p-5"><span className="badge">{q.pillar}</span><strong className="mt-3 block">{q.question}</strong><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{options.map(([label, score]) => <button key={label} onClick={() => setAnswers((a) => ({ ...a, [q.id]: { answer: label, score } }))} className={`min-h-10 rounded-md border px-3 py-2 text-sm ${answers[q.id]?.score === score ? 'border-teal-800 bg-teal-50 text-teal-900' : 'border-slate-200 hover:border-teal-700'}`}>{label}</button>)}</div></Card>)}
      <Button disabled={!data?.questions || Object.keys(answers).length < data.questions.length || submit.isPending} onClick={send}>Enviar respostas</Button>
    </main>
  );
}
