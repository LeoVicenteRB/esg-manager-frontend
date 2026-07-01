'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    const res = await api.post('/auth/login', data);
    saveSession(res.data.accessToken, res.data.user);
    router.push(defaultPathForRole(res.data.user.role));
  }

  return (
    <main className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_30%),linear-gradient(135deg,#f8fafc,#f0fdf4)] font-sans lg:grid-cols-[1.05fr_.95fr]">
      <Link
        href="/"
        className="fixed bottom-6 left-6 z-50 inline-flex h-10 items-center justify-center rounded-full border border-emerald-950/15 bg-white/90 px-4 text-sm font-semibold text-emerald-950 shadow-sm backdrop-blur transition hover:bg-emerald-50"
      >
        Voltar ao site
      </Link>

<section className="flex min-h-[44vh] flex-col justify-between p-6 sm:p-8 lg:min-h-screen lg:p-14">
        <div className="flex items-start justify-between gap-4">
          <img src="/brand/logo-florescencia-header.png" alt="Florescência" className="h-24 w-auto object-contain sm:h-28" />
</div>

        <div className="max-w-2xl pb-14 pt-4 sm:pt-8 lg:-mt-16 lg:pb-24">
          <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">Florescência - Gestão de ESG para consultorias.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Formulários públicos, dashboards, scores, relatórios e análise especialista.</p>
        </div>
      </section>

      <section className="grid place-items-center p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="glass w-full max-w-md rounded-lg p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-950">Entrar</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              E-mail
              <Input className="mt-2" autoComplete="email" {...form.register('email')} />
              {form.formState.errors.email?.message ? <span className="mt-1 block text-xs text-red-600">{form.formState.errors.email.message}</span> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Senha
              <Input className="mt-2" type="password" autoComplete="current-password" {...form.register('password')} />
              {form.formState.errors.password?.message ? <span className="mt-1 block text-xs text-red-600">{form.formState.errors.password.message}</span> : null}
            </label>
            <Button disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? 'Entrando...' : 'Acessar plataforma'}
            </Button>
            <Link className="block text-center text-sm font-medium text-teal-800 hover:text-teal-950" href="/forgot-password">
              Recuperar senha
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
