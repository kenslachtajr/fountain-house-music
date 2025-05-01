export function shouldNeverHappen(message?: string, ...args: any[]): never {
  console.error(message, ...args);

  if (process.env.NODE_ENV === 'development') {
    // uncomment this to debug locally
    // we have too many errors in the codebase right now
    // debugger;
  }

  throw new Error(`This should never happen: ${message}`);
}
