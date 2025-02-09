'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

import { useAuthenticationModal } from '~/features/authentication/hooks/use-authentication-dialog';
import { useUser } from '~/hooks/useUser';
import Button from './Button';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const { openDialog } = useAuthenticationModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // TODO: reset any playing songs
    router.refresh();

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
      <div className="flex items-center justify-between w-full mb-4">
        <div className="items-center hidden md:flex gap-x-2">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center transition bg-black rounded-full hover:opacity-75"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="flex items-center justify-center transition bg-black rounded-full hover:opacity-75"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex items-center md:hidden gap-x-2">
          <Link href="/">
            <button className="flex items-center justify-center p-2 transition bg-white rounded-full hover:opacity-75">
              <HiHome className="text-black" size={20} />
            </button>
          </Link>
          <Link href="/search">
            <button className="flex items-center justify-center p-2 transition bg-white rounded-full hover:opacity-75">
              <BiSearch className="text-black" size={20} />
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          {user ? (
            <div className="flex items-center gap-x-4">
              <Button onClick={handleLogout} className="px-6 py-2 bg-white">
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
            <>
              <div>
                <Button
                  onClick={openDialog}
                  className="font-medium bg-tranpsparent text-neutral-300"
                >
                  Sign Up
                </Button>
              </div>
              <div>
                <Button onClick={openDialog} className="px-6 py-2 bg-white">
                  Log In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
