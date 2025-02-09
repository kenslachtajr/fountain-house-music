'use client';

import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import Input from '~/components/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { useAsync } from '~/hooks/use-async';
import { getCurrentUser } from '~/server/actions/user/get-current-user';
import { getCurrentUserAuth } from '~/server/actions/user/get-current-user-auth';
import { UserDetails } from '~/types/types';
import { createClient } from '~/utils/supabase/client';

type UserDetailsForm = Pick<UserDetails, 'full_name'> & {
  email: string;
};

export function AccountProfile() {
  const supabase = createClient();
  const { data: userAuth } = useAsync(getCurrentUserAuth);
  const { data: userDetails } = useAsync(getCurrentUser);
  const userFullNameSet = useRef(false);
  const form = useForm<UserDetailsForm>({
    defaultValues: {
      email: '',
      full_name: '',
    },
  });

  const onSubmit: SubmitHandler<UserDetailsForm> = async ({
    email,
    full_name,
  }) => {
    if (!userDetails) return toast.error('User not authenticated.');

    const updates = [];

    if (form.getFieldState('email').isDirty) {
      updates.push(
        supabase.auth
          .updateUser({
            email,
            data: { full_name },
          })
          .then(({ error }) => ({
            success: !error,
            message: error?.message,
          })),
      );
    }

    if (form.getFieldState('full_name').isDirty) {
      updates.push(
        supabase
          .from('users')
          .update({ full_name })
          .eq('id', userDetails.id)
          .then(({ error }) => ({
            success: !error,
            message: error?.message,
          })),
      );
    }

    if (!updates.length) return toast('No changes were made.');

    const results = await Promise.all(updates);
    const success = results.every((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (success) {
      toast.success('Profile updated successfully.');
    } else {
      toast.error(
        `Some updates failed: ${failed.map((f) => f.message).join(', ')}`,
      );
    }

    form.reset({
      email: form.getValues('email'),
      full_name: form.getValues('full_name'),
    });
  };

  useEffect(() => {
    // ! Super jank
    const userFullName = userDetails?.full_name || '';
    const userEmail = userAuth?.email || '';
    const hasNoUserState = !userFullName || !userEmail;

    if (userFullNameSet.current || hasNoUserState) return;

    form.reset({ full_name: userFullName, email: userEmail });

    userFullNameSet.current = true;
  }, [form, userAuth?.email, userDetails?.full_name]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...form.register('full_name')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register('email')}
            />
            <span className="text-xs text-gray-400">
              You must confirm your email to update it.
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="px-2 py-1 w-fit bg-slate-200"
          >
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
