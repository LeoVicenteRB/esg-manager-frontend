'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function Specialist() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const { data } = useQuery({ queryKey: ['operational-diagnoses-specialist'], queryFn: () => api.get('/admin/operational-diagnoses').then((r) => r.data) });
  const save = useMutation({
    mutationFn: () => api.patch(`/admin/operational-diagnoses/${selected}/specialist-review`, { specialistNotes: notes }),
    onSuccess: () => {
      setNotes('');
      qc.invalidateQueries({ queryKey: ['operational-diagnoses-specialist'] });
    },
  });
  const pending = data?.filter((item: any) => !item.specialistNotes) ?? [];
  const reviewed = data?.filter((item: any) => item.specialistNotes) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Área especialista</h1>
        <p className="text-sm text-slate-500 sm:text-base">Análise técnica complementar do diagnóstico operacional.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Pendentes" value={pending.length} />
        <Metric label="Analisados" value={reviewed.length} />
        <Metric label="Críticos" value={data?.filter((item: any) => item.generalScore < 2.5).length ?? 0} />
      </div>

      <Card className="p-5">
        <h2 className="font-semibold text-slate-950">Formulário do especialista</h2>
        <div className="mt-4 grid gap-3">
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={selected} onChange={(event) => setSelected(event.target.value)}>
            <option value="">Selecione um diagnóstico</option>
            {data?.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.companyName || item.client?.companyName} - {Number(item.generalScore || 0).toFixed(1)}
              </option>
            ))}
          </select>
          <textarea
            className="min-h-36 rounded-md border border-slate-200 p-3 text-sm"
            placeholder="Diagnóstico técnico, riscos, evidências, recomendações e observações finais"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <Button disabled={!selected || !notes || save.isPending} onClick={() => save.mutate()}>
            Salvar análise
          </Button>
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
