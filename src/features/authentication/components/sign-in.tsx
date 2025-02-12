'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { useCreateQueryString } from '~/hooks/use-create-query-string';
import { signIn } from '../actions/sign-in';
import { AuthSocials } from './auth-socials';
import { FormMessage } from './form-message';

export function SignIn() {
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();

  return (
    <div className="flex flex-col gap-6">
      <AuthSocials />

      <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-[#2E3439]" />
        <span className="text-muted-foreground">or continue with</span>
        <Separator className="flex-1 bg-[#2E3439]" />
      </div>

      <form action={signIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            className="bg-[#2E3439]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            Your Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            className="bg-[#2E3439]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#404040] text-white hover:bg-[#404040]/70"
        >
          Sign in
        </Button>

        <FormMessage />
      </form>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          href={{ pathname, query: createQueryString('action', 'sign-up') }}
          className="text-muted-foreground hover:text-primary"
        >
          Don&apos;t have an account? Sign up
        </Link>
        <Link
          href={{
            pathname,
            query: createQueryString('action', 'forgot-password'),
          }}
          className="text-muted-foreground hover:text-primary"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
