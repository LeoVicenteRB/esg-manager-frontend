import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-florence-text/60">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold text-florence-text sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base text-florence-text/75 sm:text-lg">{description}</p> : null}
    </div>
  );
}
