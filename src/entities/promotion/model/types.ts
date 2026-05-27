export type PromotionType =
  | 'boost_7'
  | 'boost_30'
  | 'sub_monthly'
  | 'sub_yearly';

export type PromotionStatus = 'active' | 'expired' | 'cancelled';

export interface Promotion {
  id: string;
  project_id: string;
  project_name?: string;
  type: PromotionType;
  status: PromotionStatus;
  starts_at: string;
  ends_at?: string | null;
  payment_id: string;
  created_at: string;
}
