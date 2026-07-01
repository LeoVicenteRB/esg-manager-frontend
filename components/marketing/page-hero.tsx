import { SectionHeading } from '@/components/marketing/section-heading';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHero({ eyebrow, title, description, className }: PageHeroProps) {
  return (
    <section id="inicio" className={cn('page-header px-4 py-12 sm:px-8 sm:py-16', className)}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}
