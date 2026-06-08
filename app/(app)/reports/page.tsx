'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Download, ExternalLink, FileDown, RotateCcw, Search } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelLeadTemperature, labelStatus, labelUrgency } from '@/lib/utils';

type ReportItem = {
  id: string;
  companyName?: string;
  fullName?: string;
  professionalEmail?: string;
  createdAt?: string;
  submittedAt?: string;
  status?: string;
  generalScore?: number;
  maturityLabel?: string;
  leadScore?: number;
  leadTemperature?: string;
  urgency?: string;
  selectedLossesJson?: string[];
  specialistLaiaJson?: unknown;
  specialistLaiaScore?: number;
  specialistLaiaCriticality?: string;
  specialistLaiaPriority?: string;
  client?: { companyName?: string; cnpj?: string; sector?: string };
};

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'ANSWERED', label: 'Respondidos' },
  { value: 'UNDER_REVIEW', label: 'Em análise' },
  { value: 'REVIEWED', label: 'Validados' },
];

const criticalityOptions = [
  { value: 'all', label: 'Todas as criticidades' },
  { value: 'CRÍTICO', label: 'Crítico' },
  { value: 'ALTO / SIGNIFICATIVO', label: 'Alto / Significativo' },
  { value: 'MÉDIO', label: 'Médio' },
  { value: 'BAIXO', label: 'Baixo' },
  { value: 'pending', label: 'Sem análise LAIA' },
];

export default function Reports() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [criticality, setCriticality] = useState('all');
  const { data, isLoading } = useQuery<ReportItem[]>({ queryKey: ['reports'], queryFn: () => api.get('/reports').then((r) => r.data) });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((item) => {
      const company = companyName(item).toLowerCase();
      const owner = String(item.fullName ?? '').toLowerCase();
      const email = String(item.professionalEmail ?? '').toLowerCase();
      const matchesSearch = !term || company.includes(term) || owner.includes(term) || email.includes(term);
      const matchesStatus = status === 'all' || item.status === status;
      const itemCriticality = item.specialistLaiaCriticality || (item.specialistLaiaJson ? 'MÉDIO' : '');
      const matchesCriticality = criticality === 'all' || (criticality === 'pending' ? !item.specialistLaiaJson : itemCriticality === criticality);
      return matchesSearch && matchesStatus && matchesCriticality;
    });
  }, [data, search, status, criticality]);

  const metrics = useMemo(() => {
    const list = data ?? [];
    return {
      total: list.length,
      answered: list.filter((item) => item.status === 'ANSWERED').length,
      underReview: list.filter((item) => item.status === 'UNDER_REVIEW').length,
      reviewed: list.filter((item) => item.status === 'REVIEWED').length,
      critical: list.filter((item) => item.specialistLaiaCriticality === 'CRÍTICO').length,
    };
  }, [data]);

  const updateStatus = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: string }) => api.patch(`/admin/operational-diagnoses/${id}/status`, { status: nextStatus }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  });

  async function validateReport(item: ReportItem) {
    if (!item.specialistLaiaJson) {
      await Swal.fire({
        title: 'Análise especialista pendente',
        text: 'Preencha e salve o formulário LAIA antes de validar este relatório.',
        icon: 'warning',
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Validar relatório?',
      text: `O relatório de ${companyName(item)} será marcado como validado.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f766e',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Validar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;
    await updateStatus.mutateAsync({ id: item.id, nextStatus: 'REVIEWED' });
    await Swal.fire({
      title: 'Relatório validado',
      text: 'O status foi atualizado com sucesso.',
      icon: 'success',
      confirmButtonColor: '#0f766e',
      confirmButtonText: 'Ok',
    });
  }

  async function reopenReport(item: ReportItem) {
    const result = await Swal.fire({
      title: 'Reabrir análise?',
      text: `O relatório de ${companyName(item)} voltará para análise.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f766e',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Reabrir',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    await updateStatus.mutateAsync({ id: item.id, nextStatus: 'UNDER_REVIEW' });
  }

  async function downloadPdf(item: ReportItem) {
    const res = await api.get(`/reports/${item.id}/pdf`, { responseType: 'blob' });
    downloadBlob(res.data, `diagnostico-${slug(companyName(item))}.pdf`, 'application/pdf');
  }

  function exportCsv() {
    if (!filtered.length) {
      Swal.fire({
        title: 'Nada para exportar',
        text: 'Ajuste os filtros para selecionar relatórios.',
        icon: 'info',
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const rows = filtered.map((item) => ({
      Empresa: companyName(item),
      Responsavel: item.fullName ?? '',
      Email: item.professionalEmail ?? '',
      CNPJ: item.client?.cnpj ?? '',
      Setor: item.client?.sector ?? '',
      DataEnvio: item.submittedAt ? formatDate(item.submittedAt) : '',
      Status: labelStatus(item.status),
      NotaOperacional: decimal(item.generalScore),
      Maturidade: item.maturityLabel ?? '',
      CriticidadeLAIA: item.specialistLaiaCriticality ?? 'Pendente',
      IndiceLAIA: decimal(item.specialistLaiaScore),
      PrioridadeLAIA: item.specialistLaiaPriority ?? '',
      PontuacaoComercial: item.leadScore ?? 0,
      TemperaturaLead: labelLeadTemperature(item.leadTemperature),
      Urgencia: labelUrgency(item.urgency),
      PerdasDeclaradas: Array.isArray(item.selectedLossesJson) ? item.selectedLossesJson.join(' | ') : '',
    }));

    const csv = toCsv(rows);
    downloadBlob(csv, `relatorios-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Validação de relatórios</h1>
          <p className="text-sm text-slate-500 sm:text-base">Revise diagnósticos, valide relatórios técnicos e exporte os dados filtrados.</p>
        </div>
        <Button type="button" onClick={exportCsv} className="gap-2">
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total" value={metrics.total} />
        <Metric label="Respondidos" value={metrics.answered} />
        <Metric label="Em análise" value={metrics.underReview} />
        <Metric label="Validados" value={metrics.reviewed} />
        <Metric label="Críticos LAIA" value={metrics.critical} />
      </div>

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_240px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-teal-600/20 transition focus:ring-4"
              placeholder="Buscar por empresa, responsável ou e-mail"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={criticality} onChange={(event) => setCriticality(event.target.value)}>
            {criticalityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </Card>

      <Card className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4">Empresa</th>
                <th>Envio</th>
                <th>Status</th>
                <th>Nota</th>
                <th>LAIA</th>
                <th>Comercial</th>
                <th className="text-right pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <SkeletonRows /> : null}
              {!isLoading && filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 align-top">
                  <td className="p-4">
                    <strong className="block text-slate-950">{companyName(item)}</strong>
                    <span className="text-xs text-slate-500">{item.fullName || '-'} | {item.professionalEmail || '-'}</span>
                  </td>
                  <td className="py-4 text-slate-600">{formatDate(item.submittedAt || item.createdAt)}</td>
                  <td className="py-4"><Badge>{labelStatus(item.status)}</Badge></td>
                  <td className="py-4">
                    <strong>{decimal(item.generalScore)} / 5.0</strong>
                    <p className="text-xs text-slate-500">{item.maturityLabel || '-'}</p>
                  </td>
                  <td className="py-4">
                    <Badge>{item.specialistLaiaCriticality || 'Pendente'}</Badge>
                    <p className="mt-1 text-xs text-slate-500">{item.specialistLaiaPriority || 'Aguardando análise especialista'}</p>
                  </td>
                  <td className="py-4">
                    <strong>{item.leadScore ?? 0}</strong>
                    <p className="text-xs text-slate-500">{labelLeadTemperature(item.leadTemperature)} | {labelUrgency(item.urgency)}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex justify-end gap-2">
                      <IconAction title="Baixar PDF" onClick={() => downloadPdf(item)}><FileDown size={16} /></IconAction>
                      <Link className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" title="Visualizar" href={`/reports/${item.id}`}><ExternalLink size={16} /></Link>
                      {item.status === 'REVIEWED' ? (
                        <IconAction title="Reabrir análise" onClick={() => reopenReport(item)}><RotateCcw size={16} /></IconAction>
                      ) : (
                        <IconAction title="Validar relatório" onClick={() => validateReport(item)}><CheckCircle2 size={16} /></IconAction>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-3 lg:hidden">
        {isLoading ? <MobileSkeleton /> : null}
        {!isLoading && filtered.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-slate-950">{companyName(item)}</strong>
                <p className="text-xs text-slate-500">{item.fullName || '-'} | {formatDate(item.submittedAt || item.createdAt)}</p>
              </div>
              <Badge>{labelStatus(item.status)}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <MiniData label="Nota" value={`${decimal(item.generalScore)} / 5.0`} />
              <MiniData label="LAIA" value={item.specialistLaiaCriticality || 'Pendente'} />
              <MiniData label="Comercial" value={String(item.leadScore ?? 0)} />
              <MiniData label="Urgência" value={labelUrgency(item.urgency)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={() => downloadPdf(item)} className="h-9 gap-2 px-3"><FileDown size={15} />PDF</Button>
              <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700" href={`/reports/${item.id}`}><ExternalLink size={15} />Abrir</Link>
              {item.status === 'REVIEWED' ? (
                <button type="button" onClick={() => reopenReport(item)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700"><RotateCcw size={15} />Reabrir</button>
              ) : (
                <button type="button" onClick={() => validateReport(item)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 text-sm font-semibold text-teal-800"><CheckCircle2 size={15} />Validar</button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {!isLoading && !filtered.length ? <p className="empty">Nenhum relatório encontrado com os filtros selecionados.</p> : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl text-slate-950">{value}</strong>
    </Card>
  );
}

function MiniData({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <strong className="mt-1 block text-slate-950">{value}</strong>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

function IconAction({ title, onClick, children }: { title: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" title={title} onClick={onClick} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
      {children}
    </button>
  );
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((item) => (
        <tr key={item} className="border-t border-slate-100">
          <td className="p-4" colSpan={7}><div className="h-10 animate-pulse rounded-md bg-slate-100" /></td>
        </tr>
      ))}
    </>
  );
}

function MobileSkeleton() {
  return (
    <>
      {[0, 1].map((item) => <div key={item} className="h-36 animate-pulse rounded-lg bg-slate-100" />)}
    </>
  );
}

function companyName(item: ReportItem) {
  return item.companyName || item.client?.companyName || 'Formulário público';
}

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR');
}

function decimal(value?: number) {
  return Number(value || 0).toFixed(1);
}

function slug(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'relatorio';
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
