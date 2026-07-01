'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { IndividualDiagnosticModal } from '@/components/individual/individual-diagnostic-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { DIAGNOSIS_FORM_PATH } from '@/lib/marketing';
import { labelLeadTemperature, labelStatus } from '@/lib/utils';

export default function Forms() {
  const qc = useQueryClient();
  const [individualOpen, setIndividualOpen] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['operational-diagnoses'],
    queryFn: () => api.get('/admin/operational-diagnoses').then((r) => r.data),
  });

  const individualForms = useQuery({
    queryKey: ['individual-diagnostics'],
    queryFn: () => api.get('/admin/individual-diagnostics').then((r) => r.data),
  });

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}${DIAGNOSIS_FORM_PATH}` : DIAGNOSIS_FORM_PATH;

  const individualByReportId = useMemo(() => {
    const map = new Map<string, any>();
    (individualForms.data ?? []).forEach((item: any) => {
      if (item.reportFormId) map.set(item.reportFormId, item);
    });
    return map;
  }, [individualForms.data]);

  const rows = useMemo(() => data ?? [], [data]);

  async function copy(text: string, id?: string) {
    await navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 1600);
    }
  }

  function individualLink(slug: string) {
    return typeof window !== 'undefined' ? `${window.location.origin}/formulario-individual/${slug}` : `/formulario-individual/${slug}`;
  }

  function companyName(item: any) {
    return item.companyName || item.client?.companyName || 'Formulário público';
  }

  function isIndividual(item: any) {
    return item.diagnosisVersion === 'individual-diagnostic-v1' || item.maturityLabel === 'Diagnóstico individual' || individualByReportId.has(item.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Diagnósticos operacionais</h1>
          <p className="text-sm text-slate-500 sm:text-base">Formulário aberto, respostas e priorização comercial.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => copy(publicUrl)} className="gap-2 bg-white text-teal-900 ring-1 ring-teal-700 hover:bg-teal-50">
            <Copy size={16} />
            Copiar endereço público
          </Button>
          <Button type="button" onClick={() => setIndividualOpen(true)} className="gap-2">
            <Plus size={16} />
            Endereço individual
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Enviados" value={data?.length ?? 0} />
        <Metric label="Oportunidades quentes" value={data?.filter((item: any) => item.leadTemperature === 'hot').length ?? 0} />
        <Metric label="Urgência alta" value={data?.filter((item: any) => item.urgency === 'high').length ?? 0} />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Empresa</th>
                <th>Respondente</th>
                <th>Data</th>
                <th>Nota</th>
                <th>Oportunidade</th>
                <th>Situação</th>
                <th className="pr-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item: any) => {
                const individual = individualByReportId.get(item.id);

                return (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="p-4 font-medium">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{companyName(item)}</span>
                        {isIndividual(item) ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">Individual</span> : null}
                      </div>
                    </td>
                    <td>{item.fullName || '-'}</td>
                    <td>{new Date(item.submittedAt || item.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>{Number(item.generalScore || 0).toFixed(1)} - {item.maturityLabel}</td>
                    <td><span className="badge">{item.leadScore} / {labelLeadTemperature(item.leadTemperature)}</span></td>
                    <td><span className="badge">{labelStatus(item.status)}</span></td>
                    <td className="pr-4">
                      <div className="flex justify-end gap-2">
                        <Link className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-teal-800 hover:bg-teal-50" href={`/reports/${item.id}`}>
                          Abrir <ExternalLink size={14} />
                        </Link>
                        {individual?.slug ? (
                          <button
                            type="button"
                            title={copiedId === item.id ? 'Link copiado' : 'Copiar link individual'}
                            onClick={() => copy(individualLink(individual.slug), item.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                          >
                            <Copy size={15} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 lg:hidden">
          {rows.map((item: any) => {
            const individual = individualByReportId.get(item.id);

            return (
              <div key={item.id} className="rounded-md border border-slate-100 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{companyName(item)}</strong>
                  {isIndividual(item) ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">Individual</span> : null}
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.fullName || '-'} - {new Date(item.submittedAt || item.createdAt).toLocaleDateString('pt-BR')}</p>
                <p className="mt-2 text-sm">{Number(item.generalScore || 0).toFixed(1)} / 5.0 - {item.maturityLabel}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 px-3 text-sm font-semibold text-teal-800" href={`/reports/${item.id}`}>
                    Abrir <ExternalLink size={14} />
                  </Link>
                  {individual?.slug ? (
                    <button
                      type="button"
                      onClick={() => copy(individualLink(individual.slug), item.id)}
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700"
                    >
                      <Copy size={14} />
                      {copiedId === item.id ? 'Copiado' : 'Copiar link'}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          {!isLoading && !data?.length ? <p className="empty">Nenhum diagnóstico enviado ainda.</p> : null}
        </div>
      </Card>

      <IndividualDiagnosticModal
        open={individualOpen}
        onClose={() => setIndividualOpen(false)}
        onCreated={() => {
          qc.invalidateQueries({ queryKey: ['individual-diagnostics'] });
          qc.invalidateQueries({ queryKey: ['operational-diagnoses'] });
        }}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <strong className="mt-1 block text-3xl text-slate-950">{value}</strong>
    </Card>
  );
}
