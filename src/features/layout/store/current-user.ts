import { create } from 'zustand';
import { UserDetails } from '~/types/types';

interface CurrentUserState {
  user: UserDetails | null;
  actions: {
    setUser: (user?: UserDetails | null) => void;
  };
}

const useCurrentUserStore = create<CurrentUserState>((set) => ({
  user: null,
  actions: {
    setUser: (user?: UserDetails | null) => {
      set({ user });
    },
  },
}));

export const useCurrentUserSelect = () =>
  useCurrentUserStore((state) => state.user);
export const useCurrentUserActions = () =>
  useCurrentUserStore((state) => state.actions);
