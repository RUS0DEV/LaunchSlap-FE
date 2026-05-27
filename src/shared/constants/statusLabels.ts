import type { PaymentStatus } from '@/entities/payment/model/types';
import type { PromotionStatus } from '@/entities/promotion/model/types';

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'В ожидании',
  succeeded: 'Успешно',
  failed: 'Ошибка',
  refunded: 'Возврат',
};

export const promotionStatusLabels: Record<PromotionStatus, string> = {
  active: 'Активно',
  expired: 'Истекло',
  cancelled: 'Отменено',
};
