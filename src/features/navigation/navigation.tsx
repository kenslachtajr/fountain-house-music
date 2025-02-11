'use client';

import useAuthModal from '~/hooks/useAuthModal';
import { useRouter } from 'next/navigation';
import { useUser } from '~/hooks/useUser';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { User } from '@supabase/auth-helpers-nextjs';
import { GoHomeFill } from 'react-icons/go';

export function NavigationFeature() {
  const { user } = useUser();

  return (
    <div className="md:hidden flex justify-around align-middle h-[80px] pb-[env(safe-area-inset-bottom)]">
      <Link className="pt-3" href="/">
        <GoHomeFill size={40}/>
      </Link>
      <Link className="pt-3" href="/search">
        <BiSearch size={40} />
      </Link>
      <Profile user={user}/>
    </div>
  );
}

interface ProfileProps {
  user: User | null;
}

function Profile({ user }: ProfileProps) {
  const router = useRouter();
  const authModal = useAuthModal();

  const handleClick = () => {
    if (user) {
      router.push("/account");
    } else {
      authModal.onOpen();
    }
  };

  return (
    <button
      className="h-0 pt-3"
      onClick={handleClick}
    >
      <FaUser size={35} />
    </button>
  )
}