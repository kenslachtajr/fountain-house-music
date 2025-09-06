import { Toaster } from 'react-hot-toast';

export function GlobalToaster() {
  return (
    <Toaster
      toastOptions={{
        position: 'bottom-right',
        style: {
          background: 'hsl(220, 70%, 50%)', // app blue
          color: '#fff',
        },
      }}
    />
  );
}
