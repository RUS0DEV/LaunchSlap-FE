import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return format(date, 'dd MMM yyyy', { locale: ru });
}
