import type { ReactNode } from 'react';
import { Card } from '@/shared/ui/Card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = 'Произошла ошибка',
  description,
  action,
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-900">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-red-700">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
