import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SessionActivity } from '@/components/session/session-activity';

export const metadata: Metadata = {
  title: 'Florescência',
  description: 'Plataforma de diagnóstico operacional e ESG',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-64x64.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers><SessionActivity />{children}</Providers>
      </body>
    </html>
  );
}
