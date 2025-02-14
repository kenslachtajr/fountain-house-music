import { useEffect, useRef, useState } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

export function useAudioTime() {
  const frameRef = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<number>(0);
  const { getPosition } = useGlobalAudioPlayer();

  useEffect(() => {
    const animate = () => {
      setPos(getPosition());
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
