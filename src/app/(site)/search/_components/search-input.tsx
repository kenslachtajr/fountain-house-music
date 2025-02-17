'use client';

import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { Input } from '~/components/ui/legacy/input';

import { useDebounce } from '~/hooks/use-debounce';

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>('');

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };
    const url = qs.stringifyUrl({
      url: '/search',
      query: query,
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="Search song or artists"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
