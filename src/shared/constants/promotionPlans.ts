import type { PromotionType } from '@/entities/promotion/model/types';

export interface PromotionPlan {
  type: PromotionType;
  name: string;
  period: string;
  priceLabel: string;
  description: string;
}

export const promotionPlans: PromotionPlan[] = [
  {
    type: 'boost_7',
    name: 'Базовый',
    period: '7 дней',
    priceLabel: '990 ₽',
    description: 'Короткое размещение в Featured-секции.',
  },
  {
    type: 'boost_30',
    name: 'Расширенный',
    period: '30 дней',
    priceLabel: '2 990 ₽',
    description: 'Продвижение проекта на месяц.',
  },
  {
    type: 'sub_monthly',
    name: 'Месячная подписка',
    period: '1 месяц',
    priceLabel: '1 990 ₽/мес',
    description: 'Featured-размещение с ежемесячным продлением.',
  },
  {
    type: 'sub_yearly',
    name: 'Годовая подписка',
    period: '1 год',
    priceLabel: '14 900 ₽/год',
    description: 'Долгое продвижение для стабильных проектов.',
  },
];

export const promotionTypeLabels = promotionPlans.reduce(
  (acc, plan) => {
    acc[plan.type] = plan.name;
    return acc;
  },
  {} as Record<PromotionType, string>,
);
