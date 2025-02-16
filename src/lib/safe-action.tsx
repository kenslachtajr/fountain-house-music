import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { getCurrentUser } from '~/server/queries/user/get-current-user';

export class ActionError extends Error {}

const metadataSchema = z.object({
  shouldAuth: z.boolean(),
});

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: 'flattened',
  defineMetadataSchema: () => metadataSchema,
  handleServerError: (error) => {
    if (error instanceof ActionError) {
      return error.message;
    }

    // TODO: use generic error message in production
    return error.message;
  },
}).use(async ({ metadata, next }) => {
  if (metadata?.shouldAuth) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new ActionError('You are unauthorized to perform this action');
    }

    return next({ ctx: { user: currentUser } });
  }

  return next();
});
