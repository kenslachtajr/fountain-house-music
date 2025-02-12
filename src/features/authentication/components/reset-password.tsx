'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { signIn } from '../actions/sign-in';
import { FormMessage } from './form-message';

export function ResetPassword() {
  return (
    <div className="flex flex-col gap-6">
      <form action={signIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            New Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            className="bg-[#2E3439]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm text-muted-foreground"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            className="bg-[#2E3439]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#404040] text-white hover:bg-[#404040]/70"
        >
          Reset Password
        </Button>

        <FormMessage />
      </form>
    </div>
  );
}
