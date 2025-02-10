'use client';

import Modal from '~/components/Modal';
import {
  useIsUploadDialogOpenSelect,
  useUploadDialogActions,
} from './stores/use-upload-modal';
import { UploadFeature } from './upload';

export function UploadDialogFeature() {
  const isOpen = useIsUploadDialogOpenSelect();
  const { closeDialog } = useUploadDialogActions();

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={isOpen}
      onChange={onChange}
    >
      <UploadFeature />
    </Modal>
  );
}
