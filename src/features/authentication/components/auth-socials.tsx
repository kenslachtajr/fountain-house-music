import { FaFacebookF, FaGoogle, FaSpotify } from 'react-icons/fa';

import { Button } from '~/components/ui/button';

const socials = [
  {
    name: 'Google',
    icon: FaGoogle,
  },
  {
    name: 'Facebook',
    icon: FaFacebookF,
  },
  {
    name: 'Spotify',
    icon: FaSpotify,
  },
];

export function AuthSocials() {
  return (
    <div className="grid gap-2">
      {socials.map(({ name, icon: Icon }) => (
        <Button
          key={name}
          variant="outline"
          className="bg-[#404040] text-white hover:bg-[#404040]/70"
        >
          <Icon className="mr-2 h-4 w-4" />
          Sign in with {name}
        </Button>
      ))}
    </div>
  );
}
