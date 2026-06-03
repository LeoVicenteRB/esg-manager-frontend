'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DiagnosisCta } from '@/components/marketing/diagnosis-cta';
import { Button } from '@/components/ui/button';
import { navItems } from '@/lib/marketing';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setHasSession(Boolean(localStorage.getItem('esg.token')));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const portalHref = hasSession ? '/dashboard' : '/login';
  const portalLabel = hasSession ? 'Ir para Dashboard' : 'Entrar';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled ? 'border-accent/50 bg-white/85 shadow-soft backdrop-blur-md' : 'border-accent/30 bg-white/95 backdrop-blur-sm',
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
          <Link href="/" className="shrink-0">
            <Image src="/logo-florescencia.jpeg" alt="Logo Florescencia" width={160} height={80} className="h-14 w-auto sm:h-16" priority />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(([href, label]) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn('nav-pill', active ? 'nav-pill-active' : 'nav-pill-inactive')}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <DiagnosisCta variant="header" className="hidden sm:inline-flex" />
            <Link href={portalHref} className="hidden sm:block">
              <Button className="rounded-full bg-accent text-florence-text hover:bg-[#d9c49a]">{portalLabel}</Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 text-florence-text lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-florence-text/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-[72px] w-full max-w-sm border-b border-l border-accent/40 bg-white p-5 shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map(([href, label]) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn('nav-pill w-full text-left', active ? 'nav-pill-active' : 'nav-pill-inactive')}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <DiagnosisCta variant="header" className="mt-4 w-full justify-center" />
            <Link href={portalHref} className="mt-3 block">
              <Button className="w-full rounded-full bg-accent text-florence-text hover:bg-[#d9c49a]">{portalLabel}</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
