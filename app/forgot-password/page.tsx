'use client';
import { zodResolver } from '@hookform/resolvers/zod';
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
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Recuperar senha</h1>
        <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(submit)}>
          <Input placeholder="E-mail" {...form.register('email')}/>
          {form.formState.errors.email && <small className="text-red-600">{String(form.formState.errors.email.message)}</small>}
          <Button className="w-full">Gerar token</Button>
        </form>
        {msg && <p className="mt-4 rounded-md bg-teal-50 p-3 text-sm text-teal-900">{msg}</p>}
      </Card>
    </main>
  );
}
