'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { forgotPassword } from '../actions/forgot-password';
import { useAuthenticationDialogActions } from '../stores/use-authentication-dialog';

export function ForgotPassword() {
  const { buildDialogHref } = useAuthenticationDialogActions();

  const { execute } = useAction(forgotPassword, {
    onSuccess: () => {
      toast.success('Check your email for instructions.');
    },
    onError: ({ error }) => {
      if (error?.serverError) {
        toast.error(error.serverError);
        return;
      }

      if (error?.validationErrors) {
        toast.error(error.validationErrors.errorMessage ?? '');
        return;
      }
    },
  });

  const handleForgotPassword = async (formData: FormData) => {
    const email = String(formData.get('email'));

    execute({ email });
  };

  return (
    <form action={handleForgotPassword} className="flex flex-col gap-6">
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

      <Button
        type="submit"
        className="w-full bg-[#404040] text-white hover:bg-[#404040]/70"
      >
        Send reset password instructions
      </Button>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          href={buildDialogHref('sign-in')}
          className="text-muted-foreground hover:text-primary"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}
