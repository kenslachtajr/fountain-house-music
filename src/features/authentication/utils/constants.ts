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
  return (
    typeof value === 'string' && AUTH_ACTIONS.includes(value as AuthAction)
  );
}
