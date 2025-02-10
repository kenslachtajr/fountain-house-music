import { create } from 'zustand';

interface AuthenticationDialogState {
  isOpen: boolean;
  actions: {
    openDialog: () => void;
    closeDialog: () => void;
    toggleDialog: () => void;
  };
}

const useAuthenticationDialogStore = create<AuthenticationDialogState>(
  (set) => ({
    isOpen: false,
    actions: {
      openDialog: () => set({ isOpen: true }),
      closeDialog: () => set({ isOpen: false }),
      toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
    },
  }),
);

export const useIsAuthenticationDialogOpenSelect = () =>
  useAuthenticationDialogStore((state) => state.isOpen);
export const useAuthenticationDialogActions = () =>
  useAuthenticationDialogStore((state) => state.actions);
