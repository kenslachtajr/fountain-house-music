import { usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { AuthAction, isAuthenticationActionParam } from '../utils/constants';

function useUserActionParam() {
  return useQueryState('action', {
    parse: (action) => (isAuthenticationActionParam(action) ? action : null),
  });
}

export function useAuthenticationDialogOpenedToSelect() {
  return useUserActionParam()[0];
}

export function useIsAuthenticationDialogOpenSelect() {
  return useUserActionParam()[0] !== null;
}

export function useAuthenticationDialogActions() {
  const pathname = usePathname();
  const [_, setAction] = useUserActionParam();

  return {
    closeDialog: () => setAction(null),
    openDialogTo: (action: AuthAction) => setAction(action),
    buildDialogHref: (action: AuthAction) => {
      return { pathname, query: { action } };
    },
  };
}
