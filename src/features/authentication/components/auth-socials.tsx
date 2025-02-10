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
          <Icon className="w-4 h-4 mr-2" />
          Sign in with {name}
        </Button>
      ))}
    </div>
  );
}
