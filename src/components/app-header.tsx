'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserAlt, FaInstagram, FaFacebook } from 'react-icons/fa';
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
        </div>
        <div className="flex items-center justify-between gap-x-2 max-md:w-full">
          {/* Social Share Icons */}
          <div className="flex items-center gap-x-2 mr-4">
            <span className="text-white text-xs font-medium mr-1">Share</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://fountain-house-music.vercel.app&quote=${encodeURIComponent(
                'Listen to great Christian music with a message! Your subscriptions empowers us to continue to create more anointed music from other great singers and musicians. Sign up today!'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="text-white hover:text-blue-500 transition-colors duration-200"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href={`https://www.instagram.com/?url=https://fountain-house-music.vercel.app&text=${encodeURIComponent(
                'Listen to great Christian music with a message! Your subscriptions empowers us to continue to create more anointed music from other great singers and musicians. Sign up today!'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Instagram"
              className="text-white hover:text-pink-500 transition-colors duration-200"
            >
              <FaInstagram size={24} />
            </a>
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
