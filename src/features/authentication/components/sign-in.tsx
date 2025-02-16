'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { signIn } from '../actions/sign-in';
import { useAuthenticationDialogActions } from '../stores/use-authentication-dialog';
import { AuthSocials } from './auth-socials';

export function SignIn() {
  const { buildDialogHref, closeDialog } = useAuthenticationDialogActions();

  const { execute } = useAction(signIn, {
    onSuccess: () => {
      closeDialog();
      toast.success('Welcome back!');
    },
    onError: ({ error }) => {
      if (error?.serverError) {
        toast.error(error.serverError);
        return;
      }

      if (error?.validationErrors) {
        toast.error(error.validationErrors.errorMessage);
        return;
      }
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const password = String(formData.get('password'));
    const email = String(formData.get('email'));

    execute({ email, password });
  };

  return (
    <div className="flex flex-col gap-6">
      <AuthSocials />

      <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-[#2E3439]" />
        <span className="text-muted-foreground">or continue with</span>
        <Separator className="flex-1 bg-[#2E3439]" />
      </div>

      <form noValidate action={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            className="bg-[#2E3439]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#404040] text-white hover:bg-[#404040]/70"
        >
          Sign in
        </Button>
      </form>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          href={buildDialogHref('sign-up')}
          className="text-muted-foreground hover:text-primary"
        >
          Don&apos;t have an account? Sign up
        </Link>
        <Link
          href={buildDialogHref('forgot-password')}
          className="text-muted-foreground hover:text-primary"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
