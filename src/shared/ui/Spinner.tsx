import { cn } from '@/shared/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900',
        className,
      )}
      aria-label="Загрузка"
      role="status"
    />
  );
}
