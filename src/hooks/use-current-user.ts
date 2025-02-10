import { create } from 'zustand';

interface CurrentUserStore {
  user: any;
  actions: {
    setUser: (user: any) => void;
  };
}

const useCurrentUserState = create<CurrentUserStore>((set) => ({
  user: null,
  actions: {
    setUser: (user: any) => {
      set({ user });
    },
  },
}));

export const useCurrentUserFromStore = () =>
  useCurrentUserState((state) => state.user);
export const useCurrentUserActions = () =>
  useCurrentUserState((state) => state.actions);
