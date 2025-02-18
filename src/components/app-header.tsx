'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserAlt } from 'react-icons/fa';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { Button } from './ui/legacy/button';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const userDetails = useCurrentUserSelect();
  const { openDialogTo } = useAuthenticationDialogActions();

  return (
    <div
      className={twMerge(`h-fit bg-gradient-to-b from-blue-800 p-6`, className)}
    >
      <div className="mb-4 flex w-full items-center justify-between max-md:justify-center">
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
        </div>
        <div className="flex red items-center justify-between gap-x-2">
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
