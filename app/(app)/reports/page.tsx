'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function Reports() {
  const { data } = useQuery({ queryKey: ['reports'], queryFn: () => api.get('/reports').then((r) => r.data) });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Relatórios</h1>
        <p className="text-sm text-slate-500 sm:text-base">Relatórios do diagnóstico operacional, nota e pontuação comercial.</p>
      </div>
      <div className="grid gap-3">
        {data?.map((item: any) => (
          <Card key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong>{item.companyName || item.client?.companyName || 'Formulário público'}</strong>
              <p className="text-sm text-slate-500">{item.fullName || '-'} - {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="badge">{Number(item.generalScore || 0).toFixed(1)} / 5.0</span>
              <span className="badge">{item.maturityLabel}</span>
              <span className="badge">Pontuação comercial {item.leadScore}</span>
              <Link className="text-teal-800" href={`/reports/${item.id}`}>Visualizar</Link>
            </div>
          </Card>
        ))}
        {!data?.length ? <p className="empty">Nenhum relatório disponível.</p> : null}
      </div>
    </div>
  );
}
