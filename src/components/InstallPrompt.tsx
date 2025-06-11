"use client";

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-ignore
      window.navigator.standalone === true
    );

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for changes in display mode (for iOS 17+ and Android)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const updateStandalone = () => setIsStandalone(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mediaQuery.removeEventListener('change', updateStandalone);
    };
  }, []);

  // Hide prompt if running as installed app
  if (isStandalone) return null;

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
        className="w-full bg-blue-600 text-white rounded mb-2"
      >
        Install Fountain App
      </button>
    );
  }

  return null;
}