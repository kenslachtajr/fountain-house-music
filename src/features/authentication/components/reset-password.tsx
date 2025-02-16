'use client';

import { useAction } from 'next-safe-action/hooks';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { resetPassword } from '../actions/reset-password';
import { useAuthenticationDialogActions } from '../stores/use-authentication-dialog';

export function ResetPassword() {
  const { closeDialog } = useAuthenticationDialogActions();

  const { execute } = useAction(resetPassword, {
    onSuccess: () => {
      closeDialog();
      toast.success('Password reset successfully; Welcome back!');
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
    const confirmPassword = String(formData.get('confirmPassword'));

    execute({ password, confirmPassword });
  };

  return (
    <div className="flex flex-col gap-6">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            New Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
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
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            className="bg-[#2E3439]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#404040] text-white hover:bg-[#404040]/70"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
