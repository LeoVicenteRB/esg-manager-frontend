'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

type ScoreKey =
  | 'abrangencia'
  | 'severidade'
  | 'probabilidade'
  | 'requisitoLegal'
  | 'cicloVida'
  | 'legislacao'
  | 'politicaAmbiental'
  | 'partesInteressadas';

type LaiaItem = Record<ScoreKey, number> & {
  id: string;
  area: string;
  generatingAction: string;
  activity: string;
  environmentalAspect: string;
  environmentalImpact: string;
  situation: string;
  lifeCycleStage: string;
  climateChange: string;
  controlMeasures: string;
  recommendedAction: string;
  responsible: string;
  deadline: string;
  status: string;
  evidences: string;
  indicator: string;
  result: string;
  executiveReading: string;
};

const scoreOptions = [1, 3, 5];
const criteria: { key: ScoreKey; code: string; label: string; weight: number; low: string; medium: string; high: string }[] = [
  { key: 'abrangencia', code: 'A', label: 'Abrangência', weight: 1, low: 'Local', medium: 'Regional', high: 'Global' },
  { key: 'severidade', code: 'S', label: 'Severidade', weight: 2, low: 'Leve/reversível', medium: 'Moderada', high: 'Crítica/irreversível' },
  { key: 'probabilidade', code: 'P', label: 'Probabilidade/Frequência', weight: 1.5, low: 'Rara', medium: 'Ocasional', high: 'Frequente' },
  { key: 'requisitoLegal', code: 'L', label: 'Requisito Legal', weight: 2, low: 'Atende', medium: 'Parcial', high: 'Não atende' },
  { key: 'cicloVida', code: 'CV', label: 'Ciclo de Vida', weight: 1, low: 'Controle total', medium: 'Influência', high: 'Baixa influência' },
  { key: 'legislacao', code: 'LEG', label: 'Legislação', weight: 2, low: 'Baixo', medium: 'Moderado', high: 'Alto risco legal' },
  { key: 'politicaAmbiental', code: 'POL', label: 'Política Ambiental', weight: 1.5, low: 'Sem relação', medium: 'Indireta', high: 'Estratégica' },
  { key: 'partesInteressadas', code: 'PI', label: 'Partes Interessadas', weight: 1.5, low: 'Baixo interesse', medium: 'Moderado', high: 'Alta pressão' },
];
const situations = ['Normal', 'Anormal', 'Emergência'];
const lifeCycleStages = ['Extração / Obtenção de Matéria-Prima', 'Projeto / Planejamento', 'Transporte e Logística', 'Produção / Execução do Serviço', 'Armazenamento', 'Uso / Operação pelo Cliente', 'Manutenção', 'Destinação Final / Pós-Uso', 'Operação interna'];
const statusOptions = ['Não iniciado', 'Em andamento', 'Concluído', 'Pendente validação', 'Cancelado'];

function blankItem(index: number): LaiaItem {
  return {
    id: String(index + 1),
    area: '',
    generatingAction: '',
    activity: '',
    environmentalAspect: '',
    environmentalImpact: '',
    situation: 'Normal',
    lifeCycleStage: '',
    climateChange: 'Não',
    abrangencia: 1,
    severidade: 1,
    probabilidade: 1,
    requisitoLegal: 1,
    cicloVida: 1,
    legislacao: 1,
    politicaAmbiental: 1,
    partesInteressadas: 1,
    controlMeasures: '',
    recommendedAction: '',
    responsible: '',
    deadline: '',
    status: 'Não iniciado',
    evidences: '',
    indicator: '',
    result: '',
    executiveReading: '',
  };
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

type SavedLaiaItem = LaiaItem & {
  significanceIndex?: number;
  index?: number;
  criticality?: string;
  priority?: string;
};

function cleanLaiaItem(item: LaiaItem) {
  const { significanceIndex, index, criticality, priority, ...clean } = item as SavedLaiaItem;
  return clean;
}

function calculate(item: LaiaItem) {
  const index = round2(
    (item.abrangencia * 1 +
      item.severidade * 2 +
      item.probabilidade * 1.5 +
      item.requisitoLegal * 2 +
      item.cicloVida * 1 +
      item.legislacao * 2 +
      item.politicaAmbiental * 1.5 +
      item.partesInteressadas * 1.5) /
      12.5,
  );
  const criticality = index >= 4.5 ? 'CRÍTICO' : index >= 3.5 ? 'ALTO / SIGNIFICATIVO' : index >= 2.5 ? 'MÉDIO' : 'BAIXO';
  const priority = criticality === 'CRÍTICO' ? 'Tratamento imediato e reporte à liderança' : criticality === 'ALTO / SIGNIFICATIVO' ? 'Plano de ação prioritário' : criticality === 'MÉDIO' ? 'Controle operacional e monitoramento' : 'Manter controle e revisar';
  const recommendedAction = item.recommendedAction || (criticality === 'CRÍTICO' || criticality === 'ALTO / SIGNIFICATIVO' ? 'Definir ação corretiva/preventiva, responsável, prazo, evidência e indicador' : 'Manter controle operacional e revisar na próxima atualização do LAIA');
  return { index, criticality, priority, recommendedAction };
}

export default function Specialist() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState<LaiaItem[]>([blankItem(0)]);
  const [finalNotes, setFinalNotes] = useState('');
  const { data } = useQuery({ queryKey: ['operational-diagnoses-specialist'], queryFn: () => api.get('/admin/operational-diagnoses').then((r) => r.data) });
  const laia = useQuery({
    queryKey: ['specialist-laia', selected],
    enabled: Boolean(selected),
    queryFn: () => api.get(`/admin/operational-diagnoses/${selected}/specialist-laia`).then((r) => r.data),
  });

  useEffect(() => {
    const saved = laia.data?.review;
    if (saved?.items?.length) {
      setItems(saved.items);
      setFinalNotes(saved.finalNotes ?? '');
    } else if (selected) {
      setItems([blankItem(0)]);
      setFinalNotes('');
    }
  }, [laia.data, selected]);

  const computed = useMemo(() => items.map((item) => ({ ...item, ...calculate(item) })), [items]);
  const summary = useMemo(() => {
    const counts = computed.reduce((acc: Record<string, number>, item) => {
      acc[item.criticality] = (acc[item.criticality] ?? 0) + 1;
      return acc;
    }, {});
    const average = computed.length ? round2(computed.reduce((sum, item) => sum + item.index, 0) / computed.length) : 0;
    return { counts, average, pending: computed.filter((item) => ['CRÍTICO', 'ALTO / SIGNIFICATIVO'].includes(item.criticality) && item.status !== 'Concluído').length };
  }, [computed]);

  const save = useMutation({
    mutationFn: () => api.patch(`/admin/operational-diagnoses/${selected}/specialist-laia`, { items: items.map(cleanLaiaItem), finalNotes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['specialist-laia', selected] });
      qc.invalidateQueries({ queryKey: ['operational-diagnoses-specialist'] });
      Swal.fire({
        title: 'Análise especialista salva',
        text: 'O relatório foi atualizado e está pronto para validação.',
        icon: 'success',
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Ok',
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Não foi possível salvar',
        text: 'Revise os campos da análise especialista e tente novamente.',
        icon: 'error',
        confirmButtonColor: '#0f766e',
        confirmButtonText: 'Entendi',
      });
    },
  });

  function updateItem(index: number, key: keyof LaiaItem, value: string | number) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  }

  function addItem() {
    setItems((current) => [...current, blankItem(current.length)]);
  }

  function removeItem(index: number) {
    setItems((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)));
  }

  const pending = data?.filter((item: any) => !item.specialistLaiaJson) ?? [];
  const reviewed = data?.filter((item: any) => item.specialistLaiaJson) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Área do especialista</h1>
        <p className="text-sm text-slate-500 sm:text-base">Matriz LAIA com cálculo de significância ambiental, criticidade e plano de ação.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Metric label="Pendentes" value={pending.length} />
        <Metric label="Analisados" value={reviewed.length} />
        <Metric label="Índice médio" value={summary.average.toFixed(2)} />
        <Metric label="Ações pendentes" value={summary.pending} />
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block text-sm font-medium text-slate-700">
            <span>Diagnóstico</span>
            <select className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={selected} onChange={(event) => setSelected(event.target.value)}>
              <option value="">Selecione um diagnóstico</option>
              {data?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.companyName || item.client?.companyName} - {Number(item.generalScore || 0).toFixed(1)}
                </option>
              ))}
            </select>
          </label>
          <Button type="button" disabled={!selected} onClick={addItem} className="gap-2">
            <Plus size={16} />
            Adicionar aspecto
          </Button>
        </div>
      </Card>

      {selected ? (
        <>
          <Card className="p-5">
            <h2 className="font-semibold text-slate-950">Critérios da planilha</h2>
            <p className="mt-1 text-sm text-slate-500">Índice = ((A*1)+(S*2)+(P*1,5)+(L*2)+(CV*1)+(LEG*2)+(POL*1,5)+(PI*1,5)) / 12,5</p>
            <div className="mt-4 grid gap-2 lg:grid-cols-4">
              {criteria.map((criterion) => (
                <div key={criterion.key} className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm">
                  <strong>{criterion.code} - {criterion.label}</strong>
                  <p className="mt-1 text-xs text-slate-500">Peso {criterion.weight} | 1 {criterion.low} | 3 {criterion.medium} | 5 {criterion.high}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {computed.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="p-5">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-950">Aspecto {index + 1}</h2>
                    <p className="text-sm text-slate-500">Índice {item.index.toFixed(2)} - {item.criticality}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge">{item.priority}</span>
                    <button type="button" onClick={() => removeItem(index)} className="rounded-md p-2 text-red-600 hover:bg-red-50" title="Remover aspecto">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Área"><Text value={item.area} onChange={(value) => updateItem(index, 'area', value)} /></Field>
                  <Field label="Ação geradora"><Text value={item.generatingAction} onChange={(value) => updateItem(index, 'generatingAction', value)} /></Field>
                  <Field label="Atividade"><Text value={item.activity} onChange={(value) => updateItem(index, 'activity', value)} /></Field>
                  <Field label="Aspecto ambiental"><Text value={item.environmentalAspect} onChange={(value) => updateItem(index, 'environmentalAspect', value)} /></Field>
                  <Field label="Impacto ambiental"><Text value={item.environmentalImpact} onChange={(value) => updateItem(index, 'environmentalImpact', value)} /></Field>
                  <Field label="Situação"><Select value={item.situation} options={situations} onChange={(value) => updateItem(index, 'situation', value)} /></Field>
                  <Field label="Etapa do ciclo de vida"><Select value={item.lifeCycleStage} options={lifeCycleStages} onChange={(value) => updateItem(index, 'lifeCycleStage', value)} /></Field>
                  <Field label="Mudanças climáticas?"><Select value={item.climateChange} options={['Sim', 'Não']} onChange={(value) => updateItem(index, 'climateChange', value)} /></Field>
                  <Field label="Status"><Select value={item.status} options={statusOptions} onChange={(value) => updateItem(index, 'status', value)} /></Field>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {criteria.map((criterion) => (
                    <Field key={criterion.key} label={`${criterion.code} - ${criterion.label}`}>
                      <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={item[criterion.key]} onChange={(event) => updateItem(index, criterion.key, Number(event.target.value))}>
                        {scoreOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </Field>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  <Field label="Medidas de controle"><Area value={item.controlMeasures} onChange={(value) => updateItem(index, 'controlMeasures', value)} /></Field>
                  <Field label="Ação recomendada"><Area value={item.recommendedAction || item.recommendedAction} placeholder={item.recommendedAction} onChange={(value) => updateItem(index, 'recommendedAction', value)} /></Field>
                  <Field label="Responsável"><Text value={item.responsible} onChange={(value) => updateItem(index, 'responsible', value)} /></Field>
                  <Field label="Prazo"><Text value={item.deadline} placeholder="0 a 15 dias, 15 a 60 dias..." onChange={(value) => updateItem(index, 'deadline', value)} /></Field>
                  <Field label="Observações / Evidências"><Area value={item.evidences} onChange={(value) => updateItem(index, 'evidences', value)} /></Field>
                  <Field label="Indicador e resultado">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Text value={item.indicator} placeholder="Indicador" onChange={(value) => updateItem(index, 'indicator', value)} />
                      <Text value={item.result} placeholder="Resultado" onChange={(value) => updateItem(index, 'result', value)} />
                    </div>
                  </Field>
                  <Field label="Leitura executiva"><Area value={item.executiveReading} onChange={(value) => updateItem(index, 'executiveReading', value)} /></Field>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h2 className="font-semibold text-slate-950">Resumo da análise</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <MiniMetric label="Críticos" value={summary.counts['CRÍTICO'] ?? 0} />
              <MiniMetric label="Altos" value={summary.counts['ALTO / SIGNIFICATIVO'] ?? 0} />
              <MiniMetric label="Médios" value={summary.counts['MÉDIO'] ?? 0} />
              <MiniMetric label="Baixos" value={summary.counts['BAIXO'] ?? 0} />
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              <span>Observações finais do especialista</span>
              <textarea className="mt-1 min-h-24 w-full rounded-md border border-slate-200 p-3 text-sm" value={finalNotes} onChange={(event) => setFinalNotes(event.target.value)} />
            </label>
            <Button disabled={save.isPending || !selected || !items.length} onClick={() => save.mutate()} className="mt-4 gap-2">
              <Save size={16} />
              {save.isPending ? 'Salvando...' : 'Salvar formulário LAIA'}
            </Button>
          </Card>
        </>
      ) : null}
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

function MiniMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl text-slate-950">{value}</strong>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Text({ value, placeholder, onChange }: { value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <input className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={value ?? ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function Area({ value, placeholder, onChange }: { value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <textarea className="min-h-24 w-full rounded-md border border-slate-200 bg-white p-3 text-sm" value={value ?? ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
      <option value="">Selecione</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
