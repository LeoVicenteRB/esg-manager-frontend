import Link from 'next/link';
import { PageHero } from '@/components/marketing/page-hero';
import { Card } from '@/components/ui/card';
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/marketing';

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale Conosco"
        description="Estamos prontos para ajudar sua empresa a florescer com sustentabilidade."
      />
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-8 sm:pb-16">
        <Card className="glass marketing-card-hover rounded-3xl border-accent/40 p-6 text-center sm:p-10">
          <p className="text-lg leading-relaxed text-florence-text/80">
            Entre em contato conosco pelo WhatsApp ou e-mail e descubra como podemos apoiar sua jornada ESG.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="cta-primary">
              Conversar pelo WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-10 items-center justify-center rounded-full border border-florence-text/15 px-6 py-3 text-sm font-semibold text-florence-text transition hover:bg-white">
              {CONTACT_EMAIL}
            </a>
          </div>
          <p className="mt-8 text-florence-text/75">
            Florescencia e mais do que consultoria: e um convite para transformar seu negocio em referencia sustentavel.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-florence-text underline decoration-accent decoration-2 underline-offset-4">
            Acessar portal ESG
          </Link>
        </Card>
      </section>
    </>
  );
}
