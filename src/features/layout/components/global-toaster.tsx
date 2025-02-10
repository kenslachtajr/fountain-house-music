import { Toaster } from 'react-hot-toast';

export function GlobalToaster() {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
}
