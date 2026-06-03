'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { defaultPathForRole } from '@/lib/permissions';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const router = useRouter();
  const form = useForm<any>({ resolver: zodResolver(schema), defaultValues: { email: 'admin@hoop.local', password: 'Admin@123' } });

  async function onSubmit(data: any) {
    const res = await api.post('/auth/login', data);
    saveSession(res.data.accessToken, res.data.user);
    router.push(defaultPathForRole(res.data.user.role));
  }

  return (
    <main className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,#d9f99d,transparent_28%),linear-gradient(135deg,#f8fafc,#ecfeff)] lg:grid-cols-[1.1fr_.9fr]">
      <section className="flex flex-col justify-between p-8 lg:p-14">
        <div className="flex items-center gap-3 text-teal-950">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-900 text-white"><Leaf size={20} /></span>
          <strong>Hoop Gestão ESG</strong>
        </div>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold text-slate-950 lg:text-6xl">Gestão operacional e ESG para consultorias.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">Diagnósticos públicos, painéis, relatórios e análises com permissão por perfil.</p>
        </div>
        <p className="text-sm text-slate-500">Servidor 3333 - Interface 3000</p>
      </section>
      <section className="grid place-items-center p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="glass w-full max-w-md rounded-lg p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-950">Entrar</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">E-mail<Input className="mt-2" {...form.register('email')} /></label>
            <label className="block text-sm font-medium">Senha<Input className="mt-2" type="password" {...form.register('password')} /></label>
            <Button disabled={form.formState.isSubmitting} className="w-full">Acessar plataforma</Button>
            <Link className="block text-center text-sm text-teal-800" href="/forgot-password">Recuperar senha</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
