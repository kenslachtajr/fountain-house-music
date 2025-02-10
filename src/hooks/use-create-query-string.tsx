import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useCreateQueryString() {
  const searchParams = useSearchParams();

  return useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined) {
        params.delete(name);
        return '';
      }

      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
}
