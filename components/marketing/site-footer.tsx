import Link from 'next/link';
import { CONTACT_EMAIL, DIAGNOSIS_FORM_PATH, WHATSAPP_URL, navItems } from '@/lib/marketing';

export function SiteFooter() {
  return (
    <footer id="contato" className="border-t border-accent/40 bg-white">
      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl font-semibold text-florence-text">Florescencia</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-florence-text/75">
            Soluções sustentáveis e estratégias ESG para empresas que buscam crescimento sólido e confiável.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="cta-primary mt-6">
            Fale Conosco
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-florence-text/55">Navegação</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {navItems.map(([href, label]) => (
              <Link key={href} href={href} className="text-florence-text/80 transition hover:text-florence-text">
                {label}
              </Link>
            ))}
            <Link href={DIAGNOSIS_FORM_PATH} className="font-semibold text-florence-text transition hover:text-florence-text">
              Diagnóstico gratuito
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-florence-text/55">Contato</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-florence-text/80">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="transition hover:text-florence-text">
              WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-florence-text">
              {CONTACT_EMAIL}
            </a>
            <Link href="/login" className="font-semibold text-florence-text transition hover:underline">
              Acessar portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
