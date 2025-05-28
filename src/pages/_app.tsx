import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt) return null;
  return (
    <button onClick={handleInstall} className="p-2 bg-blue-600 text-white rounded">
      Install Fountain App
    </button>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);
  return (
    <>
      <InstallPrompt />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;