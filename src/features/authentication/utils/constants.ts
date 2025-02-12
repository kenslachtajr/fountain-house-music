export type AuthAction =
  | 'sign-in'
  | 'sign-up'
  | 'forgot-password'
  | 'reset-password';

export function isAuthenticationActionParam(
  value: unknown,
): value is AuthAction {
  return (
    typeof value === 'string' &&
    ['sign-in', 'sign-up', 'forgot-password', 'reset-password'].includes(value)
  );
}
