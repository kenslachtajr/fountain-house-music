'use server';

import { ValidationErrors } from 'next-safe-action';
import { headers } from 'next/headers';
import { z } from 'zod';
import { actionClient, ActionError } from '~/lib/safe-action';
import { createClient } from '~/utils/supabase/server';

const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must match',
        path: ['confirmPassword'],
      });
    }
  });

export const resetPassword = actionClient
  .schema(resetPasswordSchema, {
    handleValidationErrorsShape: async (ve) => handleValidationErrorsShape(ve),
  })
  .metadata({ shouldAuth: false })
  .action(async ({ parsedInput: { password } }) => {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    if (!origin) return;

    const { error, data } = await supabase.auth.updateUser(
      {
        password,
      },
      {
        emailRedirectTo: origin,
      },
    );

    if (error) {
      throw new ActionError(error.message);
    }

    return data;
  });

// TODO: make this reusable
function handleValidationErrorsShape(
  ve: ValidationErrors<typeof resetPasswordSchema>,
) {
  return {
    globalErrorMessage: ve._errors?.join(', '),
    errorMessage: [
      ve.confirmPassword && `${ve.confirmPassword._errors?.[0]}`,
      ve.password && `${ve.password._errors?.[0]}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}
