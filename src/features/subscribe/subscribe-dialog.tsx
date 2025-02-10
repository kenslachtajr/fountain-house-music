'use client';

import Modal from '~/components/Modal';
import { useSubscribeDialog } from './hooks/use-subscribe-dialog';
import { SubscribeFeature } from './subscribe';

export function SubscribeDialogFeature() {
  const { isOpen, closeDialog } = useSubscribeDialog();

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
      <SubscribeFeature />
    </Modal>
  );
}
