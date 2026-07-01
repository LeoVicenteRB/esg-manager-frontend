'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Copy, Link2, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

type AvailableQuestion = {
  id: string;
  number: number;
  section: string;
  questionText: string;
  answerType: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT';
  required: boolean;
  options: string[];
};

type CustomQuestion = {
  questionText: string;
  answerType: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT';
  optionsText: string;
  required: boolean;
};

const answerTypes = [
  { value: 'TEXT', label: 'Texto' },
  { value: 'NUMBER', label: 'Numérico' },
  { value: 'SELECT', label: 'Select' },
  { value: 'MULTI_SELECT', label: 'Select múltiplo' },
] as const;

function splitOptions(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function IndividualDiagnosticModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: () => void }) {
  const [clientName, setClientName] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [created, setCreated] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [questionSearch, setQuestionSearch] = useState('');

  const questions = useQuery({
    queryKey: ['individual-diagnostic-questions'],
    queryFn: () =>
      api.get('/public/forms/operational-diagnosis').then((res) =>
        (res.data?.questions ?? []).map((question: any) => ({
          id: question.id,
          number: question.number,
          section: question.section,
          questionText: question.text,
          answerType: question.type === 'multiple' ? 'MULTI_SELECT' : 'SELECT',
          required: question.required,
          options: (question.options ?? []).map((option: any) => option.label),
        })),
      ),
    enabled: open,
  });

  const create = useMutation({
    mutationFn: (payload: any) => api.post('/admin/individual-diagnostics', payload).then((res) => res.data),
    onSuccess: async (data) => {
      setCreated(data);
      const link = typeof window !== 'undefined' ? `${window.location.origin}/formulario-individual/${data.slug}` : `/formulario-individual/${data.slug}`;
      setSuccessMessage(`Link gerado e copiado: ${link}`);
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
      } catch {}
      onCreated?.();
    },
    onError: (error: any) => {
      const responseMessage = error?.response?.data?.error?.message ?? error?.response?.data?.message;
      const messageText = Array.isArray(responseMessage) ? responseMessage.join(' ') : responseMessage;
      setMessage(messageText || 'Não foi possível criar o formulário individual. Revise os campos.');
    },
  });

  const publicLink = useMemo(() => {
    if (!created?.slug || typeof window === 'undefined') return '';
    return `${window.location.origin}/formulario-individual/${created.slug}`;
  }, [created]);

  const filteredQuestions = useMemo(() => {
    const term = questionSearch.trim().toLowerCase();
    const list = (questions.data ?? []) as AvailableQuestion[];
    if (!term) return list;
    return list.filter((question) => `${question.number} ${question.section} ${question.questionText}`.toLowerCase().includes(term));
  }, [questions.data, questionSearch]);

  if (!open) return null;

  function addQuestion() {
    setCustomQuestions((current) => [...current, { questionText: '', answerType: 'TEXT', optionsText: '', required: true }]);
  }

  function updateQuestion(index: number, patch: Partial<CustomQuestion>) {
    setCustomQuestions((current) => current.map((question, currentIndex) => (currentIndex === index ? { ...question, ...patch } : question)));
  }

  function removeQuestion(index: number) {
    setCustomQuestions((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function toggleExistingQuestion(questionId: string) {
    setSelectedQuestionIds((current) => (current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId]));
  }

  function save() {
    setMessage('');
    setSuccessMessage('');

    if (clientName.trim().length < 2) {
      setMessage('Informe o nome do cliente ou empresa.');
      return;
    }

    const customPayload = customQuestions
      .filter((question) => question.questionText.trim().length > 0 || question.optionsText.trim().length > 0)
      .map((question) => ({
        questionText: question.questionText.trim(),
        answerType: question.answerType,
        options: splitOptions(question.optionsText),
        required: question.required,
      }));

    const invalidCustomText = customPayload.find((question) => question.questionText.length < 3);
    if (invalidCustomText) {
      setMessage('Perguntas personalizadas preenchidas precisam ter pelo menos 3 caracteres.');
      return;
    }

    const invalidSelect = customPayload.find((question) => (question.answerType === 'SELECT' || question.answerType === 'MULTI_SELECT') && question.options.length === 0);
    if (invalidSelect) {
      setMessage('Perguntas do tipo select precisam ter pelo menos uma opção.');
      return;
    }

    if (!selectedQuestionIds.length && !customPayload.length) {
      setMessage('Selecione uma pergunta existente ou adicione uma pergunta personalizada.');
      return;
    }

    create.mutate({ clientName, selectedQuestionIds, customQuestions: customPayload });
  }

  async function copyLink() {
    if (!publicLink) return;
    await navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setSuccessMessage(`Link copiado: ${publicLink}`);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/45 px-3 py-6 backdrop-blur-sm sm:px-6 lg:py-10">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-900/10" style={{ maxHeight: 'min(90vh, 820px)' }}>
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">Diagnóstico personalizado</span>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Endereço Individual</h2>
            <p className="mt-1 text-sm text-slate-500">Monte um formulário exclusivo para um cliente ou empresa.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {created ? (
            <section className="rounded-md border border-teal-100 bg-teal-50 p-4">
              <div className="flex items-center gap-2 text-teal-950">
                <Link2 size={18} />
                <strong>Link individual gerado</strong>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input readOnly value={publicLink} />
                <Button type="button" onClick={copyLink} className="gap-2">
                  <Copy size={16} />
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </section>
          ) : null}

          <section className="rounded-md border border-slate-200 bg-white p-4">
            <label className="block text-sm font-medium text-slate-700">
              Nome do cliente/empresa
              <Input className="mt-1" value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Ex.: Lemon Group" />
            </label>
          </section>

          <section className="rounded-md border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">Perguntas existentes</h3>
                <p className="text-sm text-slate-500">Selecione perguntas do diagnóstico público.</p>
              </div>
              <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
                {selectedQuestionIds.length} selecionada{selectedQuestionIds.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="p-4">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-teal-600/20 transition focus:ring-4"
                  value={questionSearch}
                  onChange={(event) => setQuestionSearch(event.target.value)}
                  placeholder="Buscar pergunta"
                />
              </label>

              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-md bg-slate-50 p-2">
                {questions.isLoading ? <p className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">Carregando perguntas...</p> : null}
                {!questions.isLoading && !filteredQuestions.length ? <p className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">Nenhuma pergunta encontrada.</p> : null}
                {filteredQuestions.map((question: AvailableQuestion) => {
                  const active = selectedQuestionIds.includes(question.id);
                  return (
                    <button
                      type="button"
                      key={question.id}
                      onClick={() => toggleExistingQuestion(question.id)}
                      className={`flex w-full gap-3 rounded-md border p-3 text-left transition ${
                        active ? 'border-teal-700 bg-white shadow-sm ring-1 ring-teal-700/10' : 'border-slate-200 bg-white hover:border-teal-300'
                      }`}
                    >
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${active ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white'}`}>
                        {active ? <Check size={13} /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Pergunta {question.number}</span>
                          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">{question.section}</span>
                        </span>
                        <span className="mt-2 block text-sm font-medium leading-5 text-slate-800">{question.questionText}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">Perguntas personalizadas</h3>
                <p className="text-sm text-slate-500">Inclua perguntas específicas para este cliente.</p>
              </div>
              <Button type="button" onClick={addQuestion} className="gap-2">
                <Plus size={16} />
                Adicionar pergunta
              </Button>
            </div>

            <div className="space-y-3 p-4">
              {!customQuestions.length ? <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Nenhuma pergunta personalizada adicionada.</p> : null}
              {customQuestions.map((question, index) => (
                <div key={index} className="rounded-md border border-slate-200 bg-slate-50/70 p-4">
                  <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
                    <label className="block text-sm font-medium text-slate-700">
                      Texto da pergunta
                      <Input className="mt-1 bg-white" value={question.questionText} onChange={(event) => updateQuestion(index, { questionText: event.target.value })} />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Tipo de resposta
                      <select
                        className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                        value={question.answerType}
                        onChange={(event) => updateQuestion(index, { answerType: event.target.value as CustomQuestion['answerType'] })}
                      >
                        {answerTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {question.answerType === 'SELECT' || question.answerType === 'MULTI_SELECT' ? (
                    <label className="mt-3 block text-sm font-medium text-slate-700">
                      Opções
                      <textarea
                        className="mt-1 min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700"
                        value={question.optionsText}
                        onChange={(event) => updateQuestion(index, { optionsText: event.target.value })}
                        placeholder="Uma opção por linha ou separada por vírgula"
                      />
                    </label>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={question.required} onChange={(event) => updateQuestion(index, { required: event.target.checked })} />
                      Pergunta obrigatória
                    </label>
                    <button type="button" onClick={() => removeQuestion(index)} className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold text-red-700 hover:bg-red-50">
                      <Trash2 size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {successMessage ? <p className="rounded-md bg-teal-50 p-3 text-sm font-medium text-teal-900">{successMessage}</p> : null}
          {message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p> : null}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" onClick={onClose} className="bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
            Fechar
          </Button>
          <Button type="button" onClick={save} disabled={create.isPending}>
            {create.isPending ? 'Gerando...' : 'Salvar e gerar link'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
