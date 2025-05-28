import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isIOS) {
    return (
      <div className="p-2 bg-yellow-200 text-black rounded mb-2">
        To install this app, tap <b>Share</b> and then <b>Add to Home Screen</b>.
      </div>
    );
  }

  if (deferredPrompt) {
    return (
      <button
        onClick={() => {
          deferredPrompt.prompt();
          setDeferredPrompt(null);
        }}
        className="p-2 bg-blue-600 text-white rounded mb-2"
      >
        Install Fountain App
      </button>
    );
  }

  return null;
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