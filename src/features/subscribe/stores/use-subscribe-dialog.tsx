import { create } from 'zustand';

interface SubscribeDialogState {
  isOpen: boolean;
  actions: {
    openDialog: () => void;
    closeDialog: () => void;
    toggleDialog: () => void;
  };
}

const useSubscribeDialogStore = create<SubscribeDialogState>((set) => ({
  isOpen: false,
  actions: {
    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
    toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
  },
}));

export const useIsSubscribeDialogOpenSelect = () =>
  useSubscribeDialogStore((state) => state.isOpen);
export const useSubscribeDialogActions = () =>
  useSubscribeDialogStore((state) => state.actions);
