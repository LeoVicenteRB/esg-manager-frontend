'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/shell/header';
import { MobileNav, Sidebar } from '@/components/shell/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('esg.token')) router.replace('/login');
    else setReady(true);
  }, [router]);

  if (!ready) {
    return <main className="grid min-h-screen place-items-center text-slate-500">Carregando...</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#f7faf9]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto w-full max-w-[1600px] px-3 py-4 pb-24 sm:px-5 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
