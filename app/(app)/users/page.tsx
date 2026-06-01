'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { labelRole } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(3, 'Informe o nome.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, 'Use no mínimo 8 caracteres, com letra maiúscula, letra minúscula, número e caractere especial.'),
  passwordConfirmation: z.string().min(1, 'Confirme a senha.'),
  role: z.string(),
  clientId: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'As senhas não conferem.',
}).refine((data) => data.role !== 'CLIENT_VIEWER' || Boolean(data.clientId), {
  path: ['clientId'],
  message: 'Selecione o cliente vinculado.',
});

export default function Users() {
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ['users'], queryFn: () => api.get('/users').then((r) => r.data) });
  const clients = useQuery({ queryKey: ['clients-user-select'], queryFn: () => api.get('/clients').then((r) => r.data) });
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CONSULTANT', password: '', passwordConfirmation: '', clientId: '' },
  });
  const role = form.watch('role');
  const errors = form.formState.errors;

  const create = useMutation({
    mutationFn: (data: any) => api.post('/users', data),
    onSuccess: () => {
      form.reset({ role: 'CONSULTANT', password: '', passwordConfirmation: '', clientId: '' });
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });

  function submit(data: any) {
    create.mutate({
      ...data,
      clientId: data.role === 'CLIENT_VIEWER' ? data.clientId : undefined,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Usuários internos</h1>
        <p className="text-sm text-slate-500 sm:text-base">Cadastro de Administrador, Consultor, Especialista e Cliente visualizador.</p>
      </div>

      <Card className="p-4 sm:p-5">
        <form onSubmit={form.handleSubmit(submit)} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label>
            <Input placeholder="Nome" {...form.register('name')} />
            <ErrorText message={errors.name?.message as string} />
          </label>
          <label>
            <Input placeholder="E-mail" {...form.register('email')} />
            <ErrorText message={errors.email?.message as string} />
          </label>
          <label>
            <Input type="password" placeholder="Senha" autoComplete="new-password" {...form.register('password')} />
            <p className="mt-1 text-xs text-slate-500">Mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial.</p>
            <ErrorText message={errors.password?.message as string} />
          </label>
          <label>
            <Input type="password" placeholder="Confirmar senha" autoComplete="new-password" {...form.register('passwordConfirmation')} />
            <ErrorText message={errors.passwordConfirmation?.message as string} />
          </label>
          <label>
            <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" {...form.register('role')}>
              <option value="ADMIN">Administrador</option>
              <option value="CONSULTANT">Consultor</option>
              <option value="SPECIALIST">Especialista</option>
              <option value="CLIENT_VIEWER">Cliente visualizador</option>
            </select>
            <ErrorText message={errors.role?.message as string} />
          </label>

          {role === 'CLIENT_VIEWER' ? (
            <label className="sm:col-span-2 xl:col-span-3">
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" {...form.register('clientId')}>
                <option value="">Selecione o cliente</option>
                {clients.data?.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName} - {client.cnpj}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.clientId?.message as string} />
            </label>
          ) : null}

          <Button disabled={create.isPending}>
            {create.isPending ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
      </Card>

      <div className="grid gap-3 md:hidden">
        {users.data?.map((user: any) => (
          <Card key={user.id} className="p-4">
            <strong>{user.name}</strong>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="badge">{labelRole(user.role)}</span>
              {user.clientViewerClient ? <span className="badge">{user.clientViewerClient.companyName}</span> : null}
            </div>
          </Card>
        ))}
      </div>

      <Card className="hidden overflow-hidden md:block">
        <div className="table-wrap">
          <table className="data-table text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Cliente vinculado</th>
              </tr>
            </thead>
            <tbody>
              {users.data?.map((user: any) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="p-4">{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge">{labelRole(user.role)}</span></td>
                  <td>{user.clientViewerClient?.companyName ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;
}
