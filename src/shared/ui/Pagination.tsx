import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <nav
      className="flex items-center justify-between gap-3"
      aria-label="Пагинация"
    >
      <Button
        type="button"
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        leftIcon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />}
      >
        Назад
      </Button>
      <span className="text-sm text-gray-600">
        Страница {page} из {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        rightIcon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
      >
        Вперёд
      </Button>
    </nav>
  );
}
