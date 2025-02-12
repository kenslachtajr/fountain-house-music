import { useEffect } from 'react';
import { useCurrentUserActions } from '~/features/layout/store/current-user';
import { UserDetails } from '~/types/types';

export const useSetUser = (user?: UserDetails | null) => {
  const { setUser } = useCurrentUserActions();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);
};
