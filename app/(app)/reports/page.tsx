'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelStatus } from '@/lib/utils';

export default function Reports() {
  const { data } = useQuery({ queryKey: ['reports'], queryFn: () => api.get('/reports').then((r) => r.data) });
  return (
    <div className="space-y-5 lg:space-y-6">
      <div><h1 className="text-2xl font-semibold sm:text-3xl">Relatorios</h1><p className="text-sm text-slate-500 sm:text-base">Formularios enviados, score, classificacao e PDF.</p></div>
      <div className="grid gap-3 md:hidden">{data?.map((f: any) => <Card key={f.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate">{f.client?.companyName || 'Publico'}</strong><p className="text-sm text-slate-500">{f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : 'Sem resposta'}</p></div><span className="badge">{labelStatus(f.status)}</span></div><div className="mt-3 flex items-center justify-between text-sm"><span>{Math.round(f.generalScore)} - {labelStatus(f.classification)}</span><Link className="font-semibold text-teal-800" href={`/reports/${f.id}`}>Visualizar</Link></div></Card>)}</div>
      <Card className="hidden overflow-hidden md:block"><div className="table-wrap"><table className="data-table text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Cliente</th><th>Envio</th><th>Resposta</th><th>Status</th><th>Score</th><th></th></tr></thead><tbody>{data?.map((f: any) => <tr key={f.id} className="border-t border-slate-100"><td className="p-4 font-medium">{f.client?.companyName || 'Publico'}</td><td>{new Date(f.createdAt).toLocaleDateString()}</td><td>{f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : '-'}</td><td><span className="badge">{labelStatus(f.status)}</span></td><td>{Math.round(f.generalScore)} - {labelStatus(f.classification)}</td><td><Link className="text-teal-800" href={`/reports/${f.id}`}>Visualizar</Link></td></tr>)}</tbody></table></div></Card>
    </div>
  );
}
