import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243524] disabled:opacity-60',
        'w-full sm:w-auto',
        className,
      )}
      {...props}
    />
  );
}
