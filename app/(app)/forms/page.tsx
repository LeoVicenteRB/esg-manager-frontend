'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelLeadTemperature, labelStatus } from '@/lib/utils';

export default function Forms() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['operational-diagnoses'], queryFn: () => api.get('/admin/operational-diagnoses').then((r) => r.data) });
  const create = useMutation({ mutationFn: () => api.post('/forms', {}).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['operational-diagnoses'] }) });
  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/diagnostico-eficiencia-operacional` : '/diagnostico-eficiencia-operacional';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Diagnósticos operacionais</h1>
          <p className="text-sm text-slate-500 sm:text-base">Formulário aberto, respostas e priorização comercial.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => navigator.clipboard.writeText(publicUrl)} className="gap-2 bg-white text-teal-900 ring-1 ring-teal-700 hover:bg-teal-50">
            <Copy size={16} />
            Copiar endereço público
          </Button>
          <Button type="button" onClick={() => create.mutate()} className="gap-2">
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: any) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium">{item.companyName || item.client?.companyName || 'Formulário público'}</td>
                  <td>{item.fullName || '-'}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{Number(item.generalScore || 0).toFixed(1)} - {item.maturityLabel}</td>
                  <td><span className="badge">{item.leadScore} / {labelLeadTemperature(item.leadTemperature)}</span></td>
                  <td><span className="badge">{labelStatus(item.status)}</span></td>
                  <td><Link className="inline-flex items-center gap-1 text-teal-800" href={`/reports/${item.id}`}>Abrir <ExternalLink size={14} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 p-3 lg:hidden">
          {data?.map((item: any) => (
            <Link key={item.id} href={`/reports/${item.id}`} className="rounded-md border border-slate-100 bg-white p-4">
              <strong>{item.companyName || item.client?.companyName || 'Formulário público'}</strong>
              <p className="mt-1 text-sm text-slate-500">{item.fullName || '-'} - {new Date(item.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 text-sm">{Number(item.generalScore || 0).toFixed(1)} / 5.0 - {item.maturityLabel}</p>
            </Link>
          ))}
          {!isLoading && !data?.length ? <p className="empty">Nenhum diagnóstico enviado ainda.</p> : null}
        </div>
      </Card>
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
