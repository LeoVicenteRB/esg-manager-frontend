'use client';

import { useQuery } from '@tanstack/react-query';
import { FileDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelStatus } from '@/lib/utils';

async function pdf(id: string) { const res = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' }); const url = URL.createObjectURL(res.data); const a = document.createElement('a'); a.href = url; a.download = `relatorio-esg-${id}.pdf`; a.click(); URL.revokeObjectURL(url); }

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery({ queryKey: ['report', id], queryFn: () => api.get(`/reports/${id}`).then((r) => r.data) });
  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold sm:text-3xl">Relatorio individual</h1><p className="text-sm text-slate-500 sm:text-base">{data?.client?.companyName || 'Formulario publico'}</p></div><button onClick={() => pdf(id)} className="inline-flex items-center gap-2 font-semibold text-teal-800"><FileDown size={18}/>Exportar PDF</button></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Card className="p-4 sm:p-5"><p>Ambiental</p><b className="text-2xl sm:text-3xl">{Math.round(data?.environmentalScore || 0)}</b></Card><Card className="p-4 sm:p-5"><p>Social</p><b className="text-2xl sm:text-3xl">{Math.round(data?.socialScore || 0)}</b></Card><Card className="p-4 sm:p-5"><p>Governanca</p><b className="text-2xl sm:text-3xl">{Math.round(data?.governanceScore || 0)}</b></Card><Card className="p-4 sm:p-5"><p>Geral</p><b className="text-2xl sm:text-3xl">{Math.round(data?.generalScore || 0)}</b><p className="badge mt-2">{labelStatus(data?.classification)}</p></Card></div>
      <Card className="p-4 sm:p-5"><h2 className="font-semibold">Respostas</h2><div className="mt-4 grid gap-2">{data?.answers?.map((a: any) => <div key={a.id} className="rounded-md border border-slate-100 p-3"><b className="block text-sm sm:text-base">{a.question.question}</b><p className="text-sm text-slate-500">{a.answer} - {a.score}</p></div>)}</div></Card>
      <div className="grid gap-4 md:grid-cols-2"><Card className="p-4 sm:p-5"><h2 className="font-semibold">Pontos fortes</h2>{data?.strengths?.length ? data.strengths.map((x: string) => <p key={x} className="mt-2 text-sm">{x}</p>) : <p className="empty">Sem dados.</p>}</Card><Card className="p-4 sm:p-5"><h2 className="font-semibold">Pontos criticos</h2>{data?.criticalPoints?.length ? data.criticalPoints.map((x: string) => <p key={x} className="mt-2 text-sm">{x}</p>) : <p className="empty">Sem dados.</p>}</Card></div>
    </div>
  );
}
