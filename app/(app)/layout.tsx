'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/shell/header';
import { MobileNav, Sidebar } from '@/components/shell/sidebar';
import { getUser } from '@/lib/auth';
import { allowedForPath, defaultPathForRole } from '@/lib/permissions';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('esg.token');
    const user = getUser();
    if (!token || !user) {
      router.replace('/login');
      return;
    }
    if (!allowedForPath(pathname, user.role)) {
      router.replace(defaultPathForRole(user.role));
      return;
    }
    setReady(true);
  }, [pathname, router]);

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
