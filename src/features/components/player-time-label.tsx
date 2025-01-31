import { useEffect, useState } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

export const TimeLabel = () => {
  const [pos, setPos] = useState(0);
  const { duration, getPosition } = useGlobalAudioPlayer();

  useEffect(() => {
    const i = setInterval(() => {
      setPos(getPosition());
    }, 500);

    return () => clearInterval(i);
  }, [getPosition]);

  return (
    <div className="inline-flex items-center justify-between gap-1 text-xs">
      <span className="tabular-nums">{formatAudioTime(pos)}</span>
      &middot;
      <span className="tabular-nums">{formatAudioTime(duration)}</span>
    </div>
  );
};

const formatAudioTime = (seconds: number) => {
  if (seconds === Infinity) {
    return '--';
  }

  const floored = Math.floor(seconds);
  let from = 14;
  let length = 5;

  // Display hours only if necessary.
  if (floored >= 3600) {
    from = 11;
    length = 8;
  }

  return new Date(floored * 1000).toISOString().substr(from, length);
};
