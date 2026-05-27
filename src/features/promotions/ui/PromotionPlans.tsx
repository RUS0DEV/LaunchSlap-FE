import type { PromotionType } from '@/entities/promotion/model/types';
import { promotionPlans } from '@/shared/constants/promotionPlans';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

interface PromotionPlansProps {
  selectedType?: PromotionType;
  isLoading?: boolean;
  onSelect: (type: PromotionType) => void;
  onCheckout: (type: PromotionType) => void;
}

export function PromotionPlans({
  selectedType,
  isLoading,
  onSelect,
  onCheckout,
}: PromotionPlansProps) {
  return (
    <div className="grid gap-3">
      {promotionPlans.map((plan) => {
        const selected = selectedType === plan.type;

        return (
          <button
            key={plan.type}
            type="button"
            className={cn(
              'rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-gray-900',
              selected
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 bg-white hover:bg-gray-50',
            )}
            onClick={() => onSelect(plan.type)}
          >
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <span className="block font-semibold text-gray-900">
                  {plan.name}
                </span>
                <span className="block text-sm text-gray-600">{plan.period}</span>
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {plan.priceLabel}
              </span>
            </span>
            <span className="mt-2 block text-sm text-gray-600">
              {plan.description}
            </span>
            {selected ? (
              <span className="mt-3 block">
                <Button
                  type="button"
                  size="sm"
                  isLoading={isLoading}
                  onClick={(event) => {
                    event.stopPropagation();
                    onCheckout(plan.type);
                  }}
                >
                  Оплатить
                </Button>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
