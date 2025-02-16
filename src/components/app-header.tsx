'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { usePlayerStoreActions } from '~/features/player/store/player.store';
import { createClient } from '~/utils/supabase/client';
import { Button } from './ui/legacy/button';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const player = usePlayerStoreActions();
  const userDetails = useCurrentUserSelect();
  const { openDialogTo } = useAuthenticationDialogActions();

  const supabaseClient = createClient();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();
    player.reset();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
    }
  };

  return (
    <div
      className={twMerge(`h-fit bg-gradient-to-b from-blue-800 p-6`, className)}
    >
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="hidden items-center gap-x-2 md:flex">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-full bg-black transition hover:opacity-75"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="flex items-center justify-center rounded-full bg-black transition hover:opacity-75"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex items-center gap-x-2 md:hidden">
          <Link href="/">
            <button className="flex items-center justify-center rounded-full bg-white p-2 transition hover:opacity-75">
              <HiHome className="text-black" size={20} />
            </button>
          </Link>
          <Link href="/search">
            <button className="flex items-center justify-center rounded-full bg-white p-2 transition hover:opacity-75">
              <BiSearch className="text-black" size={20} />
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          {userDetails ? (
            <div className="flex items-center gap-x-4">
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push('/account')}
                className="bg-white"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-x-4">
              <Button
                onClick={() => openDialogTo('sign-up')}
                className="bg-transparent px-6 py-2 text-white"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => openDialogTo('sign-in')}
                className="bg-white px-6 py-2"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
