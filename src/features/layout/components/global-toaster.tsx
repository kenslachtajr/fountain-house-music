import { Toaster } from 'react-hot-toast';

export function GlobalToaster() {
  return (
    <Toaster
      toastOptions={{
        position: 'bottom-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
}
