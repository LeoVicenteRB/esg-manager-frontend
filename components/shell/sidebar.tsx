'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ClipboardList, FileText, LayoutDashboard, UserCog, UserRoundCheck, UsersRound } from 'lucide-react';
import type { ComponentType } from 'react';
import { getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

type MenuItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  roles: string[];
};

const items: MenuItem[] = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, roles: ['ADMIN', 'CONSULTANT', 'SPECIALIST'] },
  { href: '/clients', label: 'Clientes', icon: UsersRound, roles: ['ADMIN', 'CONSULTANT', 'SPECIALIST'] },
  { href: '/forms', label: 'Diagnósticos', icon: ClipboardList, roles: ['ADMIN', 'CONSULTANT'] },
  { href: '/reports', label: 'Relatórios', icon: FileText, roles: ['ADMIN', 'CONSULTANT', 'SPECIALIST'] },
  { href: '/specialist', label: 'Especialista', icon: BarChart3, roles: ['ADMIN', 'SPECIALIST'] },
  { href: '/users', label: 'Usuários', icon: UserCog, roles: ['ADMIN'] },
  { href: '/my-diagnoses', label: 'Meus diagnósticos', icon: UserRoundCheck, roles: ['CLIENT_VIEWER'] },
];

function visibleItems() {
  const role = getUser()?.role;
  return items.filter((item) => role && item.roles.includes(role));
}

export function Sidebar() {
  const pathname = usePathname();
  const menu = visibleItems();
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/95 p-5 lg:block">
      <div className="mb-8 text-xl font-bold text-teal-900">Hoop ESG</div>
      <nav className="space-y-1">
        {menu.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
                active ? 'bg-teal-50 text-teal-900' : 'text-slate-600 hover:bg-teal-50 hover:text-teal-900',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const menu = visibleItems();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-12px_30px_rgba(15,23,42,.08)] backdrop-blur lg:hidden">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.max(menu.length, 1)}, minmax(0, 1fr))` }}>
        {menu.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[10px] font-semibold',
                active ? 'bg-teal-50 text-teal-900' : 'text-slate-500',
              )}
            >
              <Icon size={18} />
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
