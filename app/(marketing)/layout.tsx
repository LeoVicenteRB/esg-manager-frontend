import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-site flex min-h-screen flex-col bg-florence-bg text-florence-text">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
