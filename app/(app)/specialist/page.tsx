'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { specialistReviewSchema } from '@/lib/validations';

function ErrorText({ message }: { message?: unknown }) { return message ? <small className="text-red-600">{String(message)}</small> : null; }

export default function Specialist() {
  const qc = useQueryClient();
  const dash = useQuery({ queryKey: ['specialist'], queryFn: () => api.get('/specialist/dashboard').then((r) => r.data) });
  const forms = useQuery({ queryKey: ['forms-specialist'], queryFn: () => api.get('/forms?status=ANSWERED').then((r) => r.data) });
  const form = useForm<any>({ resolver: zodResolver(specialistReviewSchema), defaultValues: { priority: 'MEDIUM', adjustedScore: 50 } });
  const errors = form.formState.errors;
  const review = useMutation({ mutationFn: (d: any) => api.post('/specialist/reviews', { ...d, adjustedScore: Number(d.adjustedScore) }), onSuccess: () => { form.reset({ priority: 'MEDIUM', adjustedScore: 50 }); qc.invalidateQueries(); alert('Analise salva.'); } });
  return (
    <div className="space-y-5 lg:space-y-6">
      <div><h1 className="text-2xl font-semibold sm:text-3xl">Dashboard especialista</h1><p className="text-sm text-slate-500 sm:text-base">Analises tecnicas, pendencias e prioridades.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Card className="p-4 sm:p-5"><p>Clientes</p><b className="text-2xl sm:text-3xl">{dash.data?.assignedClients?.length || 0}</b></Card><Card className="p-4 sm:p-5"><p>Pendentes</p><b className="text-2xl sm:text-3xl">{dash.data?.pendingReviews || 0}</b></Card><Card className="p-4 sm:p-5"><p>Analisados</p><b className="text-2xl sm:text-3xl">{dash.data?.reviewedForms || 0}</b></Card><Card className="p-4 sm:p-5"><p>Media ajustada</p><b className="text-2xl sm:text-3xl">{Math.round(dash.data?.averageAdjustedScore || 0)}</b></Card><Card className="p-4 sm:p-5"><p>Criticas</p><b className="text-2xl sm:text-3xl">{dash.data?.criticalPendencies || 0}</b></Card></div>
      <Card className="h-[300px] p-4 sm:h-80 sm:p-5"><h2 className="font-semibold">Prioridade</h2><ResponsiveContainer width="100%" height="86%"><BarChart data={dash.data?.priorityChart || []} margin={{ left: -20, right: 10 }}><XAxis dataKey="name" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip/><Bar dataKey="total" fill="#0f766e"/></BarChart></ResponsiveContainer></Card>
      <Card className="p-4 sm:p-5"><h2 className="font-semibold">Formulario especialista</h2><form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={form.handleSubmit((d) => review.mutate(d))}><label className="sm:col-span-2"><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" {...form.register('formId')} onChange={(e) => { const selected = forms.data?.find((x: any) => x.id === e.target.value); form.setValue('formId', e.target.value, { shouldValidate: true }); form.setValue('clientId', selected?.clientId || '', { shouldValidate: true }); }}><option value="">Selecione formulario respondido</option>{forms.data?.map((f: any) => <option key={f.id} value={f.id}>{f.client?.companyName || 'Publico'} - {Math.round(f.generalScore)}</option>)}</select><ErrorText message={errors.formId?.message || errors.clientId?.message}/></label><input type="hidden" {...form.register('clientId')}/><label><Input placeholder="Diagnóstico Ambiental" {...form.register('environmentalDiagnosis')}/><ErrorText message={errors.environmentalDiagnosis?.message}/></label><label><Input placeholder="Diagnóstico Social" {...form.register('socialDiagnosis')}/><ErrorText message={errors.socialDiagnosis?.message}/></label><label><Input placeholder="Diagnóstico Governança" {...form.register('governanceDiagnosis')}/><ErrorText message={errors.governanceDiagnosis?.message}/></label><label><Input placeholder="Riscos identificados" {...form.register('risks')}/><ErrorText message={errors.risks?.message}/></label><label><Input placeholder="Evidencias analisadas" {...form.register('evidences')}/><ErrorText message={errors.evidences?.message}/></label><label><Input placeholder="Recomendações detalhadas" {...form.register('recommendations')}/><ErrorText message={errors.recommendations?.message}/></label><label><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" {...form.register('priority')}><option value="LOW">Baixa</option><option value="MEDIUM">Media</option><option value="HIGH">Alta</option><option value="CRITICAL">Critica</option></select><ErrorText message={errors.priority?.message}/></label><label><Input type="date" {...form.register('suggestedDeadline')}/><ErrorText message={errors.suggestedDeadline?.message}/></label><label><Input type="number" min="0" max="100" placeholder="Nota ajustada" {...form.register('adjustedScore')}/><ErrorText message={errors.adjustedScore?.message}/></label><label><Input placeholder="Observações finais" {...form.register('finalNotes')}/><ErrorText message={errors.finalNotes?.message}/></label><Button className="sm:col-span-2">Salvar analise</Button></form></Card>
    </div>
  );
}
