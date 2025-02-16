import { SafeActionResult } from 'next-safe-action';
import { z } from 'zod';

export const isActionSuccessful = <T extends z.ZodType>(
  action?: SafeActionResult<string, T, readonly [], any, any>,
): action is {
  data: T;
  serverError: undefined;
  validationError: undefined;
} => {
  if (!action) {
    return false;
  }

  if (action.serverError) {
    return false;
  }

  if (action.validationErrors) {
    return false;
  }

  return true;
};
