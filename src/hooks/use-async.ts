import { useCallback, useState } from 'react';

interface UseAsyncResult<T, A extends any[]> {
  data: T | null;
  error: any;
  isLoading: boolean;
  execute: (...args: A) => Promise<T | undefined>;
}

export function useAsync<T, A extends any[]>(
  asyncFunction: (...args: A) => Promise<T>,
  immediate: boolean = false,
  ...immediateArgs: A
): UseAsyncResult<T, A> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (...args: A): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction],
  );

  if (immediate) {
    execute(...immediateArgs);
  }

  return { data, error, isLoading, execute };
}
