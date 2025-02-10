'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useCreateQueryString } from '~/hooks/use-create-query-string';
import { forgotPassword } from '../actions/forgot-password';
import { FormMessage } from './form-message';

export function ForgotPassword() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();

  return (
    <form action={forgotPassword} className="flex flex-col gap-6">
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

      <Button className="w-full bg-[#404040] text-white hover:bg-[#404040]/70">
        Send reset password instructions
      </Button>

      <FormMessage />

      <div className="flex flex-col gap-2 text-sm text-center">
        <Link
          href={{ pathname, query: createQueryString('action', 'sign-in') }}
          className="text-muted-foreground hover:text-primary"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}
