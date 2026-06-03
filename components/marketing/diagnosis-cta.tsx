import Link from 'next/link';
import { DIAGNOSIS_FORM_PATH } from '@/lib/marketing';
import { cn } from '@/lib/utils';

type DiagnosisCtaProps = {
  variant?: 'primary' | 'outline' | 'header';
  label?: string;
  className?: string;
};

export function DiagnosisCta({
  variant = 'primary',
  label = 'Diagnóstico gratuito',
  className,
}: DiagnosisCtaProps) {
  return (
    <Link
      href={DIAGNOSIS_FORM_PATH}
      className={cn(
        variant === 'primary' && 'cta-primary text-center',
        variant === 'outline' &&
          'inline-flex min-h-10 items-center justify-center rounded-full border border-florence-text/15 px-6 py-3 text-sm font-semibold text-florence-text transition hover:bg-white',
        variant === 'header' &&
          'inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243524]',
        className,
      )}
    >
      {label}
    </Link>
  );
}
