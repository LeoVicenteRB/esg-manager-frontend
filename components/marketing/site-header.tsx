import Link from 'next/link';

const diagnosisUrl = '/diagnostico-eficiencia-operacional?origem=site';

const navItems = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#cases', label: 'Cases' },
  { href: '#contato', label: 'Contato' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#faf8f1]/95 font-sans backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Florescência">
          <img src="/brand/logo-florescencia-header.png" alt="Florescência" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center rounded-full border border-emerald-950/10 bg-white/85 p-1 text-sm font-semibold text-slate-600 shadow-sm md:flex">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 transition hover:bg-emerald-50 hover:text-emerald-950 ${
                index === 0 ? 'bg-emerald-950 text-white hover:bg-emerald-900 hover:text-white' : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link href={diagnosisUrl} className="hidden rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 sm:inline-flex">
            Diagnóstico gratuito
          </Link>
          <Link href="/dashboard" className="rounded-full bg-[#ead5a2] px-5 py-3 text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-[#dfc487]">
            Ir para Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
