'use client';

import Modal from '~/components/Modal';
import { ProductWithPrice } from '~/types/types';
import {
  useIsSubscribeDialogOpenSelect,
  useSubscribeDialogActions,
} from './stores/use-subscribe-dialog';
import { SubscribeFeature } from './subscribe';

interface SubscribeDialogProps {
  products: ProductWithPrice[];
}

export function SubscribeDialogFeature({ products }: SubscribeDialogProps) {
  const isOpen = useIsSubscribeDialogOpenSelect();
  const { closeDialog } = useSubscribeDialogActions();

  const handleChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return (
    <Modal
      title="Only for premium users"
      description="Listen with a paid subscription."
      isOpen={isOpen}
      onChange={handleChange}
    >
      <SubscribeFeature products={products} />
    </Modal>
  );
}
