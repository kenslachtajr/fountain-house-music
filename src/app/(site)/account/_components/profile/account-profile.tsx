'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
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
import { useUser } from '~/hooks/useUser';
import { Database } from '~/types/supabase';
import { UserDetails } from '~/types/types';

type UserDetailsForm = Pick<UserDetails, 'full_name'> & {
  email: string;
};

export function AccountProfile() {
  const user = useUser();
  const userFullNameSet = useRef(false);
  const supabase = useSupabaseClient<Database>();
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
    if (!user.userDetails) return toast.error('User not authenticated.');

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
          .eq('id', user.userDetails?.id)
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
  };

  useEffect(() => {
    // ! Super jank
    const userFullName = user.userDetails?.full_name || '';
    const userEmail = user.user?.email || '';
    const hasNoUserState = !(userFullName || userEmail);

    if (userFullNameSet.current && hasNoUserState) return;

    form.reset({ full_name: userFullName, email: userEmail });

    userFullNameSet.current = true;
  }, [form, user.user?.email, user.userDetails?.full_name]);

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
