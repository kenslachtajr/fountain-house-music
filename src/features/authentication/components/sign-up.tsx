'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { AuthSocials } from './auth-socials';

export function SignUp() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      <AuthSocials />

      <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-[#2E3439]" />
        <span className="text-muted-foreground">or continue with</span>
        <Separator className="flex-1 bg-[#2E3439]" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="bg-[#2E3439]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            Your Password
          </Label>
          <Input id="password" type="password" className="bg-[#2E3439]" />
        </div>

        <Button className="w-full bg-[#404040] text-white hover:bg-[#404040]/70">
          Sign Up
        </Button>

        <div className="flex flex-col gap-2 text-sm text-center">
          <Link
            href={{ pathname }}
            className="text-muted-foreground hover:text-primary"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
