import Link from 'next/link';
import { DiagnosisCta } from '@/components/marketing/diagnosis-cta';
import { Card } from '@/components/ui/card';
import { WHATSAPP_URL } from '@/lib/marketing';

type DiagnosisCtaSectionProps = {
  title?: string;
  description?: string;
  showWhatsapp?: boolean;
};

export function DiagnosisCtaSection({
  title = 'Descubra o nível de maturidade da sua operação',
  description = 'Faça o diagnóstico gratuito de eficiência operacional e receba um resultado preliminar com insights para evoluir.',
  showWhatsapp = true,
}: DiagnosisCtaSectionProps) {
  return (
    <section className="marketing-section pt-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Card className="overflow-hidden rounded-3xl border-accent/40 bg-gradient-to-br from-white via-white to-accent/20 p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-florence-text/60">Diagnóstico operacional</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-florence-text">{title}</h2>
              <p className="mt-4 text-florence-text/75">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <DiagnosisCta variant="primary" className="whitespace-nowrap" />
              {showWhatsapp ? (
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full border border-florence-text/15 px-6 py-3 text-sm font-semibold text-florence-text transition hover:bg-white">
                  Fale Conosco
                </a>
              ) : (
                <Link href="/contato" className="inline-flex min-h-10 items-center justify-center rounded-full border border-florence-text/15 px-6 py-3 text-sm font-semibold text-florence-text transition hover:bg-white">
                  Ver contato
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
