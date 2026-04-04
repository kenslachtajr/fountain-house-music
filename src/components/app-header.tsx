'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { GoHomeFill } from 'react-icons/go';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';

import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { useTheme } from '~/features/layout/components/theme-context';
import { useDebounce } from '~/hooks/use-debounce';
import { Button } from './ui/legacy/button';
import { Input } from './ui/legacy/input';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const userDetails = useCurrentUserSelect();
  const { openDialogTo } = useAuthenticationDialogActions();
  const { primaryColor } = useTheme();

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 300);

  useEffect(() => {
    if (!debouncedSearchValue) return;

    const url = qs.stringifyUrl({
      url: '/search',
      query: { title: debouncedSearchValue },
    });

    router.push(url);
  }, [debouncedSearchValue, router]);

  return (
    <div
      className={twMerge(`h-fit p-6`, className)}
      style={{ background: `linear-gradient(to bottom, ${primaryColor}dd, transparent)` }}
    >
      <div className="mb-4 flex w-full items-center justify-between max-md:w-full">
        <div className="hidden items-center gap-x-2 md:flex">
          <button
            onClick={() => router.back()}
            className="rounded-full transition-colors duration-200 hover:bg-black/20"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full transition-colors duration-200 hover:bg-black/20"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
          <Link
            href="/"
            className="rounded-full transition-colors duration-200 hover:bg-black/20 flex items-center justify-center"
          >
            <GoHomeFill className="text-white" size={30} />
          </Link>
        </div>
        <div className="flex items-center justify-between gap-x-2 max-md:w-full">
          <div className="relative hidden md:flex items-center">
            <BiSearch className="absolute left-3 text-neutral-400" size={18} />
            <Input
              placeholder="Search songs or artists"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 w-[250px] py-2 text-sm"
            />
          </div>
          {userDetails ? (
            <button
              onClick={() => router.push('/account')}
              className="w-[40px] h-[40px] max-md:hidden flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/20"
            >
              <FaUserAlt className="text-white" size={20}/>
            </button>
          ) : (
            <Button
              onClick={() => openDialogTo('sign-in')}
              className="bg-white px-6 py-2 max-md:w-full"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
