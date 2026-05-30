'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export default function Login() {
  const router = useRouter();
  const form = useForm<any>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@hoop.local', password: 'Admin@123' },
  });

  async function onSubmit(data: any) {
    const res = await api.post('/auth/login', data);
    saveSession(res.data.accessToken, res.data.user);
    router.push('/dashboard');
  }

  return (
    <main className="grid min-h-screen bg-[#fdfbf5] lg:grid-cols-[1.1fr_.9fr]">
      <section className="flex min-h-[42vh] flex-col justify-between gap-10 p-6 sm:p-8 lg:min-h-screen lg:p-14">
        <Link href="/" className="flex items-center gap-3 text-[#2f402c]">
          <Image src="/logo-florescencia.jpeg" alt="Logo Florescencia" width={120} height={60} className="h-14 w-auto" />
        </Link>
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold text-[#2f402c] sm:text-4xl lg:text-5xl">
            Portal ESG Florescencia
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#2f402c]/80 sm:text-lg">
            Formularios publicos, dashboards, scores, relatorios e analise especialista.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-[#2f402c]/70 hover:text-[#2f402c]">
          Voltar ao site
        </Link>
      </section>
      <section className="grid place-items-center p-4 sm:p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="glass w-full max-w-md rounded-lg p-5 shadow-soft sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#2f402c]">Entrar</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              E-mail
              <Input className="mt-2" {...form.register('email')} />
              {form.formState.errors.email && <small className="text-red-600">{String(form.formState.errors.email.message)}</small>}
            </label>
            <label className="block text-sm font-medium">
              Senha
              <Input className="mt-2" type="password" {...form.register('password')} />
              {form.formState.errors.password && <small className="text-red-600">{String(form.formState.errors.password.message)}</small>}
            </label>
            <Button disabled={form.formState.isSubmitting} className="w-full bg-[#2f402c] hover:bg-[#243524]">
              Acessar plataforma
            </Button>
            <Link className="block text-center text-sm text-[#2f402c]/80 hover:text-[#2f402c]" href="/forgot-password">
              Recuperar senha
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
