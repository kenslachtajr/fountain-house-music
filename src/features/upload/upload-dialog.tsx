'use client';

import Modal from '~/components/Modal';
import { useUploadDialog } from './hooks/use-upload-modal';
import { UploadFeature } from './upload';

export function UploadDialogFeature() {
  const { isOpen, closeDialog } = useUploadDialog();

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
