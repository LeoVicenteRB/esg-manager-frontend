'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelStatus } from '@/lib/utils';

export default function MyDiagnosisDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery({ queryKey: ['my-diagnosis', id], queryFn: () => api.get(`/client/diagnoses/${id}/report`).then((r) => r.data) });
  const report = data?.report;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{report?.title ?? 'Meu diagnóstico'}</h1>
        <p className="text-sm text-slate-500">Relatório consultivo do diagnóstico operacional.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Nota geral" value={`${Number(data?.generalScore || 0).toFixed(1)} / 5.0`} />
        <Metric label="Classificação" value={data?.maturityLabel ?? '-'} />
        <Metric label="Situação" value={labelStatus(data?.status)} />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">Resumo executivo</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{report?.executiveSummary?.text}</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">Resultado por pilar</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {report?.generalResult?.pillars?.map((item: any) => (
            <div key={item.pillar} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
              <span>{item.pillar}</span>
              <strong>{Number(item.score || 0).toFixed(1)}</strong>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">Plano de evolução</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Plan title="Curto prazo" items={report?.evolutionPlan?.shortTerm ?? []} />
          <Plan title="Médio prazo" items={report?.evolutionPlan?.mediumTerm ?? []} />
          <Plan title="Longo prazo" items={report?.evolutionPlan?.longTerm ?? []} />
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <strong className="mt-1 block text-xl text-slate-950">{value}</strong>
    </Card>
  );
}

function Plan({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <strong>{title}</strong>
      <div className="mt-2 space-y-2">
        {items.map((item) => <p key={item} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">{item}</p>)}
      </div>
    </div>
  );
}
