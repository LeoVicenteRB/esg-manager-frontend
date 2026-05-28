'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelStatus } from '@/lib/utils';

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/dashboard').then((r) => r.data) });
  const stats = [
    ['Clientes', data?.totalClients],
    ['Forms abertos', data?.totalOpenForms],
    ['Forms respondidos', data?.totalAnsweredForms],
    ['Media ESG', Math.round(data?.averageEsg || 0)],
    ['Ambiental', Math.round(data?.averageEnvironmental || 0)],
    ['Social', Math.round(data?.averageSocial || 0)],
    ['Governanca', Math.round(data?.averageGovernance || 0)],
  ];

  return (
    <div className="space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard ESG</h1>
        <p className="text-sm text-slate-500 sm:text-base">Visao executiva da carteira, formularios e maturidade ESG.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {stats.map(([label, value]) => (
          <Card key={label as string} className="p-4 sm:p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="mt-2 block text-2xl sm:text-3xl">{isLoading ? '...' : String(value ?? 0)}</strong>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-[320px] p-4 sm:h-96 sm:p-5">
          <h2 className="font-semibold">Evolucao por periodo</h2>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={data?.evolution || []} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip/>
              <Line dataKey="general" stroke="#0f766e"/>
              <Line dataKey="environmental" stroke="#65a30d"/>
              <Line dataKey="social" stroke="#2563eb"/>
              <Line dataKey="governance" stroke="#7c3aed"/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-[320px] p-4 sm:h-96 sm:p-5">
          <h2 className="font-semibold">Status dos formularios</h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={(data?.statusChart || []).map((x: any) => ({ ...x, name: labelStatus(x.name) }))} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip/>
              <Bar dataKey="total" fill="#0f766e" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4 sm:p-5"><h2 className="font-semibold">Piores notas</h2><div className="mt-4 space-y-2">{data?.worstClients?.length ? data.worstClients.map((f: any) => <div className="flex justify-between gap-3 rounded-md bg-red-50 p-3 text-sm" key={f.id}><span className="min-w-0 truncate">{f.client?.companyName || 'Publico'}</span><b>{Math.round(f.generalScore)}</b></div>) : <p className="empty">Sem dados.</p>}</div></Card>
        <Card className="p-4 sm:p-5"><h2 className="font-semibold">Melhores notas</h2><div className="mt-4 space-y-2">{data?.bestClients?.length ? data.bestClients.map((f: any) => <div className="flex justify-between gap-3 rounded-md bg-emerald-50 p-3 text-sm" key={f.id}><span className="min-w-0 truncate">{f.client?.companyName || 'Publico'}</span><b>{Math.round(f.generalScore)}</b></div>) : <p className="empty">Sem dados.</p>}</div></Card>
      </div>
    </div>
  );
}
