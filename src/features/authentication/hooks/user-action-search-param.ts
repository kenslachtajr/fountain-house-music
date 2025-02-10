import { useSearchParams } from 'next/navigation';
import { isAuthenticationActionParam } from '../utils/constants';

export function useUserActionSearchParam() {
  const searchParams = useSearchParams();
  const searchEntries = Object.fromEntries([...searchParams.entries()]);

  if (!isAuthenticationActionParam(searchEntries.action)) return;

  return searchEntries.action;
}
