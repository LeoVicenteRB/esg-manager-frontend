'use client';

import { useQuery } from '@tanstack/react-query';
import { FileDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelUrgency } from '@/lib/utils';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery({ queryKey: ['report', id], queryFn: () => api.get(`/reports/${id}`).then((r) => r.data) });
  const report = data?.report;

  async function downloadPdf() {
    const res = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnóstico-operacional-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{report?.title ?? 'Relatório operacional'}</h1>
          <p className="text-sm text-slate-500">{data?.fullName} - {data?.professionalEmail}</p>
        </div>
        <Button type="button" onClick={downloadPdf} className="gap-2 bg-white text-teal-900 ring-1 ring-teal-700 hover:bg-teal-50">
          <FileDown size={16} />
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Nota geral" value={`${Number(data?.generalScore || 0).toFixed(1)} / 5.0`} />
        <Metric label="Classificação" value={data?.maturityLabel ?? '-'} />
        <Metric label="Pontuação comercial" value={String(data?.leadScore ?? 0)} />
        <Metric label="Urgência" value={labelUrgency(data?.urgency)} />
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

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-950">Riscos identificados</h2>
          <div className="mt-4 space-y-2">
            {report?.risks?.map((item: any) => (
              <div key={item.risk} className="rounded-md border border-slate-100 p-3 text-sm">
                <strong>{item.risk}</strong>
                <p className="text-slate-500">{item.impact}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-950">Oportunidades</h2>
          <div className="mt-4 space-y-2">
            {report?.opportunities?.map((item: string) => <p key={item} className="rounded-md bg-teal-50 p-3 text-sm text-teal-950">{item}</p>)}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">Diagnóstico por tema</h2>
        <div className="mt-4 grid gap-3">
          {report?.diagnosisByTheme?.map((item: any) => (
            <div key={item.pillar} className="rounded-md border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>{item.pillar}</strong>
                <span className="badge">{item.maturityLevel}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.evidence}</p>
              <p className="mt-2 text-sm text-slate-500">{item.adjustmentNeed}</p>
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
