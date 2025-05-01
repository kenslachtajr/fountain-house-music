export function shouldNeverHappen(message?: string, ...args: any[]): never {
  console.error(message, ...args);

  if (process.env.NODE_ENV === 'development') {
    debugger;
  }

  throw new Error(`This should never happen: ${message}`);
}
