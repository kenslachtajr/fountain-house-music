'use client';

import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/legacy/button';
import { Input } from '~/components/ui/legacy/input';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { UserDetails } from '~/types/types';
import { createClient } from '~/utils/supabase/client';

type UserDetailsForm = Pick<UserDetails, 'full_name'> & {
  email: string;
};

export function AccountProfile() {
  const user = useCurrentUserSelect();
  const supabase = createClient();
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
    if (!user) return toast.error('User not authenticated.');

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
          .eq('id', user.id)
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
    const userFullName = user?.full_name || '';
    const userEmail = user?.email || '';
    const hasNoUserState = !userFullName && !userEmail;

    if (userFullNameSet.current || hasNoUserState) return;

    setTimeout(() => {
      form.reset({ full_name: userFullName, email: userEmail });
    }, 100);

    userFullNameSet.current = true;
  }, [form, user?.email, user?.full_name]);

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
