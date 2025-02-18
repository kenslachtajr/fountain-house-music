'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { GoHomeFill } from 'react-icons/go';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { UserDetails } from '~/types/types';
import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';

export function MobileNavigationFeature() {
  const userDetails = useCurrentUserSelect();

  return (
    <div className="md:hidden flex justify-around align-middle h-[80px] pb-[env(safe-area-inset-bottom)]">
      <Link className="pt-3" href="/">
        <GoHomeFill size={40}/>
      </Link>
      <Link className="pt-3" href="/search">
        <BiSearch size={40} />
      </Link>
      <Profile userDetails={userDetails}/>
    </div>
  );
}

function Profile({ userDetails }: { userDetails: UserDetails | null }) {
  const router = useRouter();
  const { openDialogTo } = useAuthenticationDialogActions();

  const handleClick = () => {
    if (userDetails) {
      router.push('/account');
    } else {
      openDialogTo('sign-in')
    }
  };

  return (
    <button className="h-0 pt-3" onClick={handleClick}>
      <FaUser size={35} />
    </button>
  );
}