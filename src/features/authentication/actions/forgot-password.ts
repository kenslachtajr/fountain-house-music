'use server';

import { ValidationErrors } from 'next-safe-action';
import { headers } from 'next/headers';
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
    const origin = (await headers()).get('origin');

    if (!origin) return;

    const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: origin,
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
