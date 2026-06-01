'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function MyDiagnoses() {
  const { data, isLoading } = useQuery({ queryKey: ['my-diagnoses'], queryFn: () => api.get('/client/diagnoses').then((r) => r.data) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Meus diagnósticos</h1>
        <p className="text-sm text-slate-500 sm:text-base">Acompanhe os diagnósticos vinculados ao seu e-mail profissional.</p>
      </div>

      <div className="grid gap-3">
        {data?.map((item: any) => (
          <Link key={item.id} href={`/my-diagnoses/${item.id}`}>
            <Card className="p-4 transition hover:border-teal-500">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <strong>{item.companyName || item.client?.companyName}</strong>
                  <p className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="badge">{Number(item.generalScore || 0).toFixed(1)} / 5.0</span>
                  <span className="badge">{item.maturityLabel}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {!isLoading && !data?.length ? <p className="empty">Nenhum diagnóstico vinculado ao seu usuário.</p> : null}
      </div>
    </div>
  );
}
