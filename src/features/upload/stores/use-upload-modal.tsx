import { create } from 'zustand';

interface UploadDialogState {
  isOpen: boolean;
  actions: {
    openDialog: () => void;
    closeDialog: () => void;
    toggleDialog: () => void;
  };
}

const useUploadDialogStore = create<UploadDialogState>((set) => ({
  isOpen: false,
  actions: {
    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
    toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
  },
}));

export const useIsUploadDialogOpenSelect = () =>
  useUploadDialogStore((state) => state.isOpen);
export const useUploadDialogActions = () =>
  useUploadDialogStore((state) => state.actions);
