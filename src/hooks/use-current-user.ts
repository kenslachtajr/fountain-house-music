import { create } from 'zustand';
import { UserDetails } from '~/types/types';

interface CurrentUserStore {
  user: UserDetails | null;
  actions: {
    setUser: (user?: UserDetails | null) => void;
  };
}

const useCurrentUserState = create<CurrentUserStore>((set) => ({
  user: null,
  actions: {
    setUser: (user?: UserDetails | null) => {
      set({ user });
    },
  },
}));

export const useCurrentUserFromStore = () =>
  useCurrentUserState((state) => state.user);
export const useCurrentUserActions = () =>
  useCurrentUserState((state) => state.actions);
