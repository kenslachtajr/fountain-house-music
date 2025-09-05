import { useEffect, useRef } from 'react';

export function useIdleTimer(onIdle: () => void, idleMs = 15 * 60 * 1000) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(onIdle, idleMs);
    };

    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, idleMs]);
}