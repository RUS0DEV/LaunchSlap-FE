import type { PromotionType } from '@/entities/promotion/model/types';

export type PaymentProvider = 'yukassa' | 'tinkoff';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  user_id: string;
  project_id: string;
  project_name?: string;
  project?: {
    id: string;
    name: string;
  };
  provider: PaymentProvider;
  provider_payment_id: string;
  amount: number;
  status: PaymentStatus;
  promotion_type: PromotionType;
  created_at: string;
}
