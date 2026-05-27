import { useState } from 'react';
import { toast } from 'sonner';
import type { Project } from '@/entities/project/model/types';
import type { PromotionType } from '@/entities/promotion/model/types';
import { useCreateCheckoutMutation } from '@/features/promotions/api/promotionsApi';
import { PromotionPlans } from '@/features/promotions/ui/PromotionPlans';
import {
  getApiErrorCode,
  getApiErrorMessage,
} from '@/shared/lib/apiError';
import { Modal } from '@/shared/ui/Modal';

interface PromoteProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromoteProjectModal({
  project,
  isOpen,
  onClose,
}: PromoteProjectModalProps) {
  const [selectedType, setSelectedType] = useState<PromotionType>('boost_7');
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const handleCheckout = async (type: PromotionType) => {
    if (!project) {
      return;
    }

    try {
      const response = await createCheckout({
        project_id: project.id,
        type,
      }).unwrap();

      window.location.href = response.redirect_url;
    } catch (error) {
      if (getApiErrorCode(error) === 'FEATURED_SLOTS_FULL') {
        toast.error(
          'Сейчас все featured-слоты заняты. Возможность очереди появится позже.',
        );
        return;
      }

      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Продвинуть проект"
      description={project?.name}
      onClose={onClose}
    >
      <PromotionPlans
        selectedType={selectedType}
        isLoading={isLoading}
        onSelect={setSelectedType}
        onCheckout={handleCheckout}
      />
    </Modal>
  );
}
