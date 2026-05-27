export function formatPrice(amount?: number | null) {
  const normalized = typeof amount === 'number' ? amount / 100 : 0;

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(normalized);
}
