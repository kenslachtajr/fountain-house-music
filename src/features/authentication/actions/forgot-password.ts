'use server';

import { ValidationErrors } from 'next-safe-action';
import { z } from 'zod';
import { actionClient, ActionError } from '~/lib/safe-action';
import { createClient } from '~/utils/supabase/server';

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email is invalid' }),
});

export const forgotPassword = actionClient
  .schema(forgotPasswordSchema, {
    handleValidationErrorsShape: async (ve) => handleValidationErrorsShape(ve),
  })
  .metadata({ shouldAuth: false })
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();

    // Canonical base URL (set this in Vercel to https://fountainhousemusic.com)
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fountainhousemusic.com';

    // Build a correct, slash-safe redirect URL for Supabase confirmation emails
    const redirectTo = new URL('/auth/confirm', baseUrl).toString();

    const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw new ActionError(error.message);
    }

    return data;
  });

// TODO: make this reusable
function handleValidationErrorsShape(
  ve: ValidationErrors<typeof forgotPasswordSchema>,
) {
  return {
    globalErrorMessage: ve._errors?.join(', '),
    errorMessage: ve.email && `${ve.email._errors?.[0]}`,
  };
}
