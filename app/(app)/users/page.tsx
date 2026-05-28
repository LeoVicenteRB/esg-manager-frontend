'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { userSchema } from '@/lib/validations';

function ErrorText({ message }: { message?: unknown }) { return message ? <small className="text-red-600">{String(message)}</small> : null; }

export default function Users() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['users'], queryFn: () => api.get('/users').then((r) => r.data) });
  const form = useForm<any>({ resolver: zodResolver(userSchema), defaultValues: { role: 'CONSULTANT', password: 'Admin@123' } });
  const errors = form.formState.errors;
  const create = useMutation({ mutationFn: (d: any) => api.post('/users', d), onSuccess: () => { form.reset({ role: 'CONSULTANT', password: 'Admin@123' }); qc.invalidateQueries({ queryKey: ['users'] }); alert('Usuario cadastrado.'); } });
  return (
    <div className="space-y-5 lg:space-y-6">
      <div><h1 className="text-2xl font-semibold sm:text-3xl">Usuarios internos</h1><p className="text-sm text-slate-500 sm:text-base">Cadastro de Admin, Consultor, Especialista e Cliente visualizador.</p></div>
      <Card className="p-4 sm:p-5"><form onSubmit={form.handleSubmit((d) => create.mutate(d))} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><label><Input placeholder="Nome" {...form.register('name')}/><ErrorText message={errors.name?.message}/></label><label><Input placeholder="E-mail" {...form.register('email')}/><ErrorText message={errors.email?.message}/></label><label><Input placeholder="Senha" {...form.register('password')}/><ErrorText message={errors.password?.message}/></label><label><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" {...form.register('role')}><option value="ADMIN">Admin</option><option value="CONSULTANT">Consultor</option><option value="SPECIALIST">Especialista</option><option value="CLIENT_VIEWER">Cliente visualizador</option></select><ErrorText message={errors.role?.message}/></label><Button>Cadastrar</Button></form></Card>
      <div className="grid gap-3 md:hidden">{data?.map((u: any) => <Card key={u.id} className="p-4"><strong>{u.name}</strong><p className="text-sm text-slate-500">{u.email}</p><span className="badge mt-2">{u.role}</span></Card>)}</div>
      <Card className="hidden overflow-hidden md:block"><div className="table-wrap"><table className="data-table text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Nome</th><th>E-mail</th><th>Perfil</th></tr></thead><tbody>{data?.map((u: any) => <tr key={u.id} className="border-t border-slate-100"><td className="p-4">{u.name}</td><td>{u.email}</td><td><span className="badge">{u.role}</span></td></tr>)}</tbody></table></div></Card>
    </div>
  );
}
