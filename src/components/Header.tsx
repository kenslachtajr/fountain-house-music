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

import useAuthModal from '~/hooks/useAuthModal';
import { useUser } from '~/hooks/useUser';
import Button from './Button';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();

  const { user } = useUser();

  return (
    <div
      className={twMerge(`h-fit bg-gradient-to-b from-blue-800 p-6`, className)}
    >
      <div className="flex items-center justify-between w-full mb-4 max-md:justify-end">
        <div className="items-center hidden md:flex gap-x-2">
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
        <div className="flex items-center justify-between gap-x-2">
          {user ? (
            <button
              onClick={() => router.push('/account')}
              className="w-[35px] h-[35px] max-md:hidden flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/20"
            >
              <FaUserAlt className="text-white" size={15}/>
            </button>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="font-medium bg-tranpsparent text-neutral-300"
                >
                  Sign Up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="px-6 py-2 bg-white"
                >
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
