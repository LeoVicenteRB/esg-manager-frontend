'use client';

import Image from 'next/image';
import { DiagnosisCta } from '@/components/marketing/diagnosis-cta';
import { GooeyFilter } from '@/components/ui/gooey-filter';
import { PixelTrail } from '@/components/ui/pixel-trail';
import { useScreenSize } from '@/hooks/use-screen-size';
import { WHATSAPP_URL } from '@/lib/marketing';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80';

export function HeroSection() {
  const screenSize = useScreenSize();

  return (
    <section className="relative min-h-[580px] overflow-hidden rounded-b-[2.5rem] lg:min-h-[640px]">
      <Image src={HERO_IMAGE} alt="Floresta sustentavel" fill priority className="object-cover opacity-35" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-br from-florence-bg/95 via-florence-bg/75 to-accent/25" />

      <GooeyFilter id="gooey-filter-hero" strength={5} />

      <div className="absolute inset-0 z-0" style={{ filter: 'url(#gooey-filter-hero)' }}>
        <PixelTrail
          pixelSize={screenSize.lessThan('md') ? 24 : 32}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-accent"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="glass max-w-2xl flex-1 animate-fade-up rounded-2xl p-6 sm:p-8">
          <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-florence-text/70">
            Soluções Sustentáveis
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight text-florence-text sm:text-4xl lg:text-5xl">
            Ajudamos empresas a resolver problemas e alcancar melhores resultados,{' '}
            <span className="text-primary">unindo responsabilidade e estratégia</span> para um crescimento sólido e confiável
          </h1>
          <p className="mt-5 text-base leading-relaxed text-florence-text/80 sm:text-lg">
            Consultoria ESG com foco em impacto positivo, responsabilidade e resultados.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DiagnosisCta variant="primary" />
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="cta-primary text-center">
              Fale Conosco
            </a>
          </div>
        </div>
        <div className="flex flex-1 justify-center lg:justify-end">
          <Image
            src="/images/floral.png"
            alt="Decoração Floral"
            width={520}
            height={520}
            className="max-h-[360px] w-full max-w-sm object-contain drop-shadow-2xl lg:max-h-[420px] lg:max-w-md"
            priority
          />
        </div>
      </div>
    </section>
  );
}
