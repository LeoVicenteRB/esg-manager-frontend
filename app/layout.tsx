import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
export const metadata:Metadata={title:'Hoop ESG Manager',description:'SaaS de gestao ESG'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><Providers>{children}</Providers></body></html>;}
