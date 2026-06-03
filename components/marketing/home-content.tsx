'use client';

import Link from 'next/link';
import { Award, Building2, Leaf } from 'lucide-react';
import { DiagnosisCta } from '@/components/marketing/diagnosis-cta';
import { DiagnosisCtaSection } from '@/components/marketing/diagnosis-cta-section';
import { FeatureCard } from '@/components/marketing/feature-card';
import { SectionHeading } from '@/components/marketing/section-heading';
import { Card } from '@/components/ui/card';

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
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <DiagnosisCta variant="outline" />
            <Link
              href="/servicos"
              className="text-sm font-semibold text-florence-text underline decoration-accent decoration-2 underline-offset-4"
            >
              Conheca todos os serviços
            </Link>
          </div>
        </div>
      </section>

      <DiagnosisCtaSection
        title="Transforme sustentabilidade em vantagem competitiva"
        description="Comece pelo diagnóstico gratuito ou converse com a Florescencia para estruturar sua jornada ESG com clareza e resultado."
      />
    </>
  );
}
