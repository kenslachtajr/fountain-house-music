import { useEffect, useRef, useState } from 'react';
import { useUnifiedAudio } from './use-unified-audio';

export function useAudioTime() {
  const frameRef = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const { getPosition } = useUnifiedAudio();

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current >= 250) {
        setPos(getPosition());
        lastUpdateRef.current = timestamp;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [getPosition]);

  return pos;
}
