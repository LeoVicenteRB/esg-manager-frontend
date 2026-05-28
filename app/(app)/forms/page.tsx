'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { labelStatus } from '@/lib/utils';

export default function Forms() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['forms'], queryFn: () => api.get('/forms').then((r) => r.data) });
  const create = useMutation({ mutationFn: () => api.post('/forms', {}), onSuccess: () => qc.invalidateQueries({ queryKey: ['forms'] }) });
  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-semibold sm:text-3xl">Formularios ESG</h1><p className="text-sm text-slate-500 sm:text-base">Links publicos unicos e acompanhamento de status.</p></div>
        <Button onClick={() => create.mutate()}>Novo link</Button>
      </div>
      <div className="grid gap-3 sm:gap-4">
        {data?.length ? data.map((f: any) => (
          <Card key={f.id} className="flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0"><strong className="block truncate">{f.client?.companyName || 'Formulario publico'}</strong><p className="text-sm text-slate-500">{labelStatus(f.status)} - Score {Math.round(f.generalScore)} - {labelStatus(f.classification)}</p></div>
            <button onClick={() => navigator.clipboard.writeText(`${location.origin}/form/${f.publicToken}`)} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800"><Copy size={16}/>Copiar link</button>
          </Card>
        )) : <p className="empty">Nenhum formulario criado.</p>}
      </div>
    </div>
  );
}
