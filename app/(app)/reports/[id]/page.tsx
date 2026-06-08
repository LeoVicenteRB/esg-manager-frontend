'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, FileDown, FlaskConical, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelStatus, labelUrgency } from '@/lib/utils';

type TabKey = 'operational' | 'specialist';

type LaiaItem = {
  id?: string;
  area?: string;
  generatingAction?: string;
  activity?: string;
  environmentalAspect?: string;
  environmentalImpact?: string;
  situation?: string;
  lifeCycleStage?: string;
  climateChange?: string;
  abrangencia?: number;
  severidade?: number;
  probabilidade?: number;
  requisitoLegal?: number;
  cicloVida?: number;
  legislacao?: number;
  politicaAmbiental?: number;
  partesInteressadas?: number;
  controlMeasures?: string;
  significanceIndex?: number;
  criticality?: string;
  priority?: string;
  recommendedAction?: string;
  responsible?: string;
  deadline?: string;
  status?: string;
  evidences?: string;
  indicator?: string;
  result?: string;
  executiveReading?: string;
};

type LaiaReview = {
  items?: LaiaItem[];
  finalNotes?: string;
};

type LaiaSummary = {
  totalItems?: number;
  averageIndex?: number;
  counts?: Record<string, number>;
  highestCriticality?: string;
  mainPriority?: string;
  pendingActions?: number;
  finalNotes?: string;
};

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('operational');
  const { data } = useQuery({ queryKey: ['report', id], queryFn: () => api.get(`/reports/${id}`).then((r) => r.data) });
  const report = data?.report;
  const laiaReview = (data?.specialistLaiaJson ?? {}) as LaiaReview;
  const laiaSummary = (data?.specialistLaiaSummaryJson ?? {}) as LaiaSummary;
  const laiaItems = laiaReview.items ?? [];

  async function downloadPdf() {
    const res = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' });
    downloadBlob(res.data, `diagnostico-operacional-${id}.pdf`, 'application/pdf');
  }

  function exportLaiaCsv() {
    const rows = laiaItems.map((item, index) => ({
      ID: item.id || index + 1,
      'Área': item.area ?? '',
      'Ações Geradoras': item.generatingAction ?? '',
      'Atividade': item.activity ?? '',
      'Aspecto Ambiental': item.environmentalAspect ?? '',
      'Impacto Ambiental': item.environmentalImpact ?? '',
      'Situação': item.situation ?? '',
      'Etapa Ciclo de Vida': item.lifeCycleStage ?? '',
      'Mudanças Climáticas?': item.climateChange ?? '',
      'Abrangência (A)': item.abrangencia ?? '',
      'S': item.severidade ?? '',
      'P': item.probabilidade ?? '',
      'L': item.requisitoLegal ?? '',
      'CV': item.cicloVida ?? '',
      'Índice de Significância Ambiental (Média Ponderada)': decimal(item.significanceIndex),
      'Medidas de Controle': item.controlMeasures ?? '',
      'Legislação': item.legislacao ?? '',
      'Política Ambiental': item.politicaAmbiental ?? '',
      'Partes Interessadas': item.partesInteressadas ?? '',
      'Criticidade ESG-Ambiental': item.criticality ?? '',
      'Prioridade / Direcionamento': item.priority ?? '',
      'Ação Recomendada': item.recommendedAction ?? '',
      'Responsável': item.responsible ?? '',
      'Prazo': item.deadline ?? '',
      'Status': item.status ?? '',
      'Observações / Evidências': item.evidences ?? '',
      'Indicador': item.indicator ?? '',
      'Resultado': item.result ?? '',
      'Leitura executiva': item.executiveReading ?? '',
    }));
    downloadBlob(toCsv(rows), `laia-${slug(data?.companyName || data?.client?.companyName || String(id))}.csv`, 'text/csv;charset=utf-8;');
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
        <Metric label="Nota geral" value={`${decimal(data?.generalScore)} / 5.0`} />
        <Metric label="Classificação" value={data?.maturityLabel ?? '-'} />
        <Metric label="Status" value={labelStatus(data?.status)} />
        <Metric label="Urgência" value={labelUrgency(data?.urgency)} />
      </div>

      <Card className="p-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <TabButton active={activeTab === 'operational'} onClick={() => setActiveTab('operational')} icon={<ScrollText size={16} />} title="Operacional" subtitle="Diagnóstico, pilares, riscos e plano de evolução" />
          <TabButton active={activeTab === 'specialist'} onClick={() => setActiveTab('specialist')} icon={<FlaskConical size={16} />} title="Especialista" subtitle={laiaItems.length ? `${laiaItems.length} aspecto(s) LAIA avaliados` : 'Análise LAIA pendente'} />
        </div>
      </Card>

      {activeTab === 'operational' ? <OperationalReport report={report} /> : null}
      {activeTab === 'specialist' ? (
        <SpecialistLaia
          data={data}
          laiaItems={laiaItems}
          laiaReview={laiaReview}
          laiaSummary={laiaSummary}
          onExportCsv={exportLaiaCsv}
        />
      ) : null}
    </div>
  );
}

function OperationalReport({ report }: { report: any }) {
  return (
    <div className="space-y-6">
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
              <strong>{decimal(item.score)}</strong>
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

function SpecialistLaia({
  data,
  laiaItems,
  laiaReview,
  laiaSummary,
  onExportCsv,
}: {
  data: any;
  laiaItems: LaiaItem[];
  laiaReview: LaiaReview;
  laiaSummary: LaiaSummary;
  onExportCsv: () => void;
}) {
  if (!laiaItems.length) {
    return (
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">Relatório LAIA do especialista</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Nenhuma análise LAIA foi salva para este relatório ainda.</p>
        <Link href="/specialist" className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-teal-800">
          Abrir área do especialista
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Relatório LAIA do especialista</h2>
          <p className="text-sm text-slate-500">Matriz técnica por cliente, no padrão da planilha LAIA.</p>
        </div>
        <Button type="button" onClick={onExportCsv} className="gap-2">
          <Download size={16} />
          Exportar CSV LAIA
        </Button>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MiniMetric label="Índice médio" value={decimal(laiaSummary.averageIndex ?? data?.specialistLaiaScore)} />
          <MiniMetric label="Criticidade maior" value={laiaSummary.highestCriticality ?? data?.specialistLaiaCriticality ?? '-'} />
          <MiniMetric label="Aspectos avaliados" value={String(laiaSummary.totalItems ?? laiaItems.length)} />
          <MiniMetric label="Ações pendentes" value={String(laiaSummary.pendingActions ?? 0)} />
          <MiniMetric label="Prioridade" value={laiaSummary.mainPriority ?? data?.specialistLaiaPriority ?? '-'} />
        </div>
        {(laiaReview.finalNotes || laiaSummary.finalNotes) ? (
          <div className="mt-5 rounded-md bg-slate-50 p-4">
            <strong className="text-sm text-slate-950">Observações finais</strong>
            <p className="mt-2 text-sm leading-6 text-slate-600">{laiaReview.finalNotes || laiaSummary.finalNotes}</p>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4">Aspecto</th>
                <th>Impacto</th>
                <th>Situação</th>
                <th>Índice</th>
                <th>Criticidade</th>
                <th>Ação recomendada</th>
                <th>Responsável</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {laiaItems.map((item, index) => (
                <tr key={`${item.id ?? index}-${index}`} className="border-t border-slate-100 align-top">
                  <td className="p-4">
                    <strong className="block text-slate-950">{item.environmentalAspect || '-'}</strong>
                    <span className="text-xs text-slate-500">{item.area || '-'} | {item.activity || '-'}</span>
                  </td>
                  <td className="py-4 text-slate-600">{item.environmentalImpact || '-'}</td>
                  <td className="py-4 text-slate-600">{item.situation || '-'}</td>
                  <td className="py-4 font-semibold text-slate-950">{decimal(item.significanceIndex)}</td>
                  <td className="py-4"><Badge>{item.criticality || '-'}</Badge></td>
                  <td className="py-4 text-slate-600">{item.recommendedAction || '-'}</td>
                  <td className="py-4 text-slate-600">{item.responsible || '-'}</td>
                  <td className="py-4 pr-4"><Badge>{item.status || '-'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function TabButton({ active, onClick, icon, title, subtitle }: { active: boolean; onClick: () => void; icon: ReactNode; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-h-16 items-center gap-3 rounded-md border p-3 text-left transition ${active ? 'border-teal-200 bg-teal-50 text-teal-950' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
    >
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${active ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{icon}</span>
      <span>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs opacity-80">{subtitle}</span>
      </span>
    </button>
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

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <strong className="mt-1 block text-sm text-slate-950">{value}</strong>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{children}</span>;
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

function decimal(value?: number) {
  return Number(value || 0).toFixed(2).replace('.00', '.0');
}

function slug(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'cliente';
}

function toCsv(rows: Record<string, unknown>[]) {
  const headers = Object.keys(rows[0] ?? {});
  const body = rows.map((row) => headers.map((header) => csvCell(row[header])).join(';')).join('\n');
  return `\uFEFF${headers.join(';')}\n${body}`;
}

function csvCell(value: unknown) {
  const text = String(value ?? '').replace(/"/g, '""');
  return `"${text}"`;
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
