'use client';

import { LogOut, Search } from 'lucide-react';
import { getUser, logout } from '@/lib/auth';

export function Header() {
  const user = typeof window !== 'undefined' ? getUser() : null;
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#2f402c] lg:hidden">Florescencia</p>
        <div className="hidden w-full max-w-md items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
          <Search size={16} />
          Buscar
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden max-w-[160px] truncate text-sm text-slate-600 sm:inline">{user?.name}</span>
        <button onClick={logout} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" title="Sair">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
