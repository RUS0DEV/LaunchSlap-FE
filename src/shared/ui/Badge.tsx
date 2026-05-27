import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/lib/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'featured';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-gray-200 bg-gray-100 text-gray-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-700',
  featured: 'border-indigo-200 bg-indigo-50 text-indigo-700',
};

interface BadgeProps extends PropsWithChildren {
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
