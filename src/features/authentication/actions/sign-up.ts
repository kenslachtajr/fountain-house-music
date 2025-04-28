'use server';

import { ValidationErrors } from 'next-safe-action';
import { headers } from 'next/headers';
import { z } from 'zod';
import { actionClient, ActionError } from '~/lib/safe-action';

import { createClient } from '~/utils/supabase/server';

const signUpSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email is invalid' }),
});

export const signUp = actionClient
  .schema(signUpSchema, {
    handleValidationErrorsShape: async (ve) => handleValidationErrorsShape(ve),
  })
  .metadata({ shouldAuth: false })
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    if (!origin) return;

    console.log(origin);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: origin,
      },
    });

    if (error) {
      throw new ActionError(error.message);
    }

    return { ...data, origin };
  });

// TODO: make this reusable
function handleValidationErrorsShape(
  ve: ValidationErrors<typeof signUpSchema>,
) {
  return {
    globalErrorMessage: ve._errors?.join(', '),
    errorMessage: [
      ve.email && `${ve.email._errors?.[0]}`,
      ve.password && `${ve.password._errors?.[0]}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}
