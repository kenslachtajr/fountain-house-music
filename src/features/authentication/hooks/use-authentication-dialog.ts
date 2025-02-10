import { create } from 'zustand';

interface AuthenticationDialogStore {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
}

export const useAuthenticationModal = create<AuthenticationDialogStore>(
  (set) => ({
    isOpen: false,
    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
    toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
  }),
);
