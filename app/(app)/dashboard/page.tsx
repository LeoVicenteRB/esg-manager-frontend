'use client';

import { useQuery } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/dashboard').then((r) => r.data) });
  const stats = [
    ['Diagnósticos', data?.totalDiagnoses],
    ['Média de maturidade', data?.averageMaturity ? `${data.averageMaturity.toFixed(1)} / 5` : '0 / 5'],
    ['Oportunidades quentes', data?.hotLeads],
    ['Oportunidades mornas', data?.warmLeads],
    ['Urgência alta', data?.urgentCompanies],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Painel operacional</h1>
        <p className="text-sm text-slate-500 sm:text-base">Maturidade, perdas declaradas, leads e pilares críticos.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value]) => (
          <Card key={String(label)} className="p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="mt-2 block text-3xl text-slate-950">{isLoading ? '...' : String(value ?? 0)}</strong>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Evolução mensal">
          <LineChart data={data?.evolution ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="average" stroke="#0f766e" strokeWidth={2} />
            <Line dataKey="total" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Principais perdas declaradas">
          <BarChart data={data?.lossChart ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-semibold text-slate-950">Pilares com menor média</h2>
          <div className="mt-4 space-y-2">
            {data?.lowestPillars?.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between rounded-md bg-amber-50 p-3 text-sm">
                <span>{item.name}</span>
                <strong>{Number(item.average || 0).toFixed(1)}</strong>
              </div>
            )) ?? <p className="empty">Sem dados.</p>}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold text-slate-950">Classificação de maturidade</h2>
          <div className="mt-4 space-y-2">
            {data?.classificationChart?.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between rounded-md bg-teal-50 p-3 text-sm">
                <span>{item.name}</span>
                <strong>{item.total}</strong>
              </div>
            )) ?? <p className="empty">Sem dados.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactElement }) {
  return (
    <Card className="h-[340px] p-5">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <ResponsiveContainer width="100%" height="88%">
        {children}
      </ResponsiveContainer>
    </Card>
  );
}
