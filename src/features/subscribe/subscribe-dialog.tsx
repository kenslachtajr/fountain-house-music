'use client';

import { useEffect } from 'react';
import { Modal } from '~/components/ui/legacy/modal';
import { ProductWithPrice } from '~/types/types';
import { useCurrentUserSelect } from '../layout/store/current-user';
import {
  useIsSubscribeDialogOpenSelect,
  useSubscribeDialogActions,
} from './stores/use-subscribe-dialog';
import { SubscribeFeature } from './subscribe';

interface SubscribeDialogProps {
  products: ProductWithPrice[];
}

export function SubscribeDialogFeature({ products }: SubscribeDialogProps) {
  const user = useCurrentUserSelect();
  const isOpen = useIsSubscribeDialogOpenSelect();
  const { closeDialog } = useSubscribeDialogActions();

  const handleChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  useEffect(() => {
    if (!user?.subscription) return;
    closeDialog();
  }, [user?.subscription]);

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
