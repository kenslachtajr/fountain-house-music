import { shouldNeverHappen } from '~/utils/should-never-happen';

const AUTH_ACTIONS = [
  'sign-in',
  'sign-up',
  'forgot-password',
  'reset-password',
] as const;
export type AuthAction = (typeof AUTH_ACTIONS)[number];

export function isAuthenticationActionParam(
  value: unknown,
): value is AuthAction {
  if (typeof value !== 'string') {
    return shouldNeverHappen(
      `Authentication action must be a string, got ${typeof value}`,
    );
  }

  if (!AUTH_ACTIONS.includes(value as AuthAction)) {
    return shouldNeverHappen(`Invalid authentication action: ${value}`);
  }

  return true;
}
