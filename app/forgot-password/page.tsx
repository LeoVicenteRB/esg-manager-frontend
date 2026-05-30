'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { forgotPasswordSchema } from '@/lib/validations';

export default function Forgot() {
  const [msg, setMsg] = useState('');
  const form = useForm<any>({ resolver: zodResolver(forgotPasswordSchema) });
  async function submit(data: any) {
    const res = await api.post('/auth/forgot-password', data);
    setMsg(res.data.resetToken ? `Token dev: ${res.data.resetToken}` : res.data.message);
  }
  return (
    <main className="grid min-h-screen place-items-center bg-[#fdfbf5] p-6">
      <Card className="w-full max-w-md border-[#e5d3af]/40 p-6">
        <h1 className="font-serif text-2xl font-semibold text-[#2f402c]">Recuperar senha</h1>
        <p className="mt-2 text-sm text-[#2f402c]/75">Florescencia - Portal ESG</p>
        <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(submit)}>
          <Input placeholder="E-mail" {...form.register('email')} />
          {form.formState.errors.email && <small className="text-red-600">{String(form.formState.errors.email.message)}</small>}
          <Button className="w-full bg-[#2f402c] hover:bg-[#243524]">Gerar token</Button>
        </form>
        {msg && <p className="mt-4 rounded-md bg-[#e5d3af]/40 p-3 text-sm text-[#2f402c]">{msg}</p>}
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <Link href="/login" className="text-[#2f402c]/80 hover:text-[#2f402c]">
            Voltar ao login
          </Link>
          <Link href="/" className="text-[#2f402c]/80 hover:text-[#2f402c]">
            Voltar ao site
          </Link>
        </div>
      </Card>
    </main>
  );
}
