'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { maskCnpj, maskPhone, maskUf } from '@/lib/masks';
import { labelStatus } from '@/lib/utils';
import { clientSchema } from '@/lib/validations';

function ErrorText({ message }: { message?: unknown }) { return message ? <small className="text-red-600">{String(message)}</small> : null; }

export default function Clients() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['clients'], queryFn: () => api.get('/clients').then((r) => r.data) });
  const form = useForm<any>({ resolver: zodResolver(clientSchema), defaultValues: { companySize: 'MEDIUM', employeesCount: 0, city: '', state: '' } });
  const errors = form.formState.errors;
  const create = useMutation({ mutationFn: (d: any) => api.post('/clients', { ...d, employeesCount: Number(d.employeesCount) }), onSuccess: () => { form.reset({ companySize: 'MEDIUM', employeesCount: 0, city: '', state: '' }); qc.invalidateQueries({ queryKey: ['clients'] }); alert('Cliente salvo.'); } });
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/clients/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }) });

  return (
    <div className="space-y-5 lg:space-y-6">
      <div><h1 className="text-2xl font-semibold sm:text-3xl">Clientes</h1><p className="text-sm text-slate-500 sm:text-base">CRUD de empresas avaliadas pela consultoria.</p></div>
      <Card className="p-4 sm:p-5">
        <form onSubmit={form.handleSubmit((d) => create.mutate(d))} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label><Input placeholder="Razao social" {...form.register('companyName')}/><ErrorText message={errors.companyName?.message}/></label>
          <label><Input placeholder="Nome fantasia" {...form.register('tradeName')}/><ErrorText message={errors.tradeName?.message}/></label>
          <label><Input placeholder="CNPJ" {...form.register('cnpj', { onChange: (e) => form.setValue('cnpj', maskCnpj(e.target.value), { shouldValidate: true }) })}/><ErrorText message={errors.cnpj?.message}/></label>
          <label><Input placeholder="Setor" {...form.register('sector')}/><ErrorText message={errors.sector?.message}/></label>
          <label><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" {...form.register('companySize')}><option value="MEI">MEI</option><option value="MICRO">Micro</option><option value="SMALL">Pequeno</option><option value="MEDIUM">Medio</option><option value="LARGE">Grande</option><option value="ENTERPRISE">Enterprise</option></select><ErrorText message={errors.companySize?.message}/></label>
          <label><Input type="number" min="0" placeholder="Funcionarios" {...form.register('employeesCount')}/><ErrorText message={errors.employeesCount?.message}/></label>
          <label><Input placeholder="Cidade" {...form.register('city')}/><ErrorText message={errors.city?.message}/></label>
          <label><Input placeholder="UF" {...form.register('state', { onChange: (e) => form.setValue('state', maskUf(e.target.value), { shouldValidate: true }) })}/><ErrorText message={errors.state?.message}/></label>
          <label><Input placeholder="Responsavel" {...form.register('responsibleName')}/><ErrorText message={errors.responsibleName?.message}/></label>
          <label><Input placeholder="E-mail" {...form.register('responsibleEmail')}/><ErrorText message={errors.responsibleEmail?.message}/></label>
          <label><Input placeholder="Telefone" {...form.register('responsiblePhone', { onChange: (e) => form.setValue('responsiblePhone', maskPhone(e.target.value), { shouldValidate: true }) })}/><ErrorText message={errors.responsiblePhone?.message}/></label>
          <Button className="gap-2 sm:self-start"><Plus size={16}/>Adicionar</Button>
        </form>
      </Card>
      <div className="grid gap-3 md:hidden">
        {data?.map((c: any) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><h3 className="truncate font-semibold">{c.companyName}</h3><p className="text-sm text-slate-500">{maskCnpj(c.cnpj)}</p></div>
              <button onClick={() => remove.mutate(c.id)} className="text-red-600"><Trash2 size={16}/></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600"><span>{c.sector}</span><span>{c.city}/{c.state}</span><span className="badge">{labelStatus(c.status)}</span></div>
          </Card>
        ))}
      </div>
      <Card className="hidden overflow-hidden md:block">
        <div className="table-wrap">
          <table className="data-table text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Empresa</th><th>CNPJ</th><th>Setor</th><th>Status</th><th></th></tr></thead>
            <tbody>{data?.map((c: any) => <tr key={c.id} className="border-t border-slate-100"><td className="p-4 font-medium">{c.companyName}<p className="text-xs text-slate-500">{c.city}/{c.state}</p></td><td>{maskCnpj(c.cnpj)}</td><td>{c.sector}</td><td><span className="badge">{labelStatus(c.status)}</span></td><td><button onClick={() => remove.mutate(c.id)} className="text-red-600"><Trash2 size={16}/></button></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
