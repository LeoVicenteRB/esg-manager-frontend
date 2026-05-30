'use client';

import Link from 'next/link';
import { Award, Building2, Leaf } from 'lucide-react';
import { FeatureCard } from '@/components/marketing/feature-card';
import { SectionHeading } from '@/components/marketing/section-heading';
import { Card } from '@/components/ui/card';
import { WHATSAPP_URL } from '@/lib/marketing';

const stats = [
  { value: '18+', label: 'Anos de experiência' },
  { value: '3', label: 'Pilares ESG integrados' },
  { value: 'B2B', label: 'Consultoria especializada' },
] as const;

const services = [
  {
    title: 'Diagnóstico e Estratégia ESG',
    description: 'Mapeamento de maturidade, plano de ação e priorização de iniciativas com foco em resultados.',
    icon: Award,
  },
  {
    title: 'Descarbonização e Circularidade',
    description: 'Estratégias climáticas, pegada de carbono e praticas de economia circular para reduzir impacto.',
    icon: Leaf,
  },
  {
    title: 'Certificações e Conformidade',
    description: 'Apoio em certificações, compliance regulatorio e governança ESG alinhada ao mercado.',
    icon: Building2,
  },
] as const;

export function HomeContent() {
  return (
    <>
      <section className="marketing-section">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-2xl border-accent/40 bg-white/90 p-5 text-center shadow-card">
              <strong className="font-serif text-3xl text-florence-text">{stat.value}</strong>
              <p className="mt-2 text-sm text-florence-text/75">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="marketing-section pt-0">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="center"
            eyebrow="Nossa atuação"
            title="Estratégia ESG com impacto real"
            description="Soluções praticas para empresas que querem evoluir em sustentabilidade com clareza, metodo e performance."
            className="mx-auto mb-10 max-w-3xl"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <FeatureCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={index * 0.08}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/servicos"
              className="text-sm font-semibold text-florence-text underline decoration-accent decoration-2 underline-offset-4"
            >
              Conheca todos os serviços
            </Link>
          </div>
        </div>
      </section>

      <section className="marketing-section pt-0">
        <div className="mx-auto max-w-6xl">
          <Card className="overflow-hidden rounded-3xl border-accent/40 bg-gradient-to-br from-white via-white to-accent/20 p-8 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-florence-text/60">Pronto para comecar?</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-florence-text">Transforme sustentabilidade em vantagem competitiva</h2>
                <p className="mt-4 text-florence-text/75">
                  Converse com a Florescencia e descubra como estruturar sua jornada ESG com clareza e resultado.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="cta-primary text-center">
                  Fale Conosco
                </a>
                <Link href="/contato" className="inline-flex min-h-10 items-center justify-center rounded-full border border-florence-text/15 px-6 py-3 text-sm font-semibold text-florence-text transition hover:bg-white">
                  Ver contato
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
