'use client';

import { LikeButton } from '~/components/like-button';
import { useSetSongsToState } from '~/features/player/hooks/use-set-songs-to-state';
import { usePlayerStoreActions, usePlayerCurrentSongSelect } from '~/features/player/store/player.store';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { Song } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';

interface AlbumContentProps {
  songs: Song[];
}

export function AlbumContent({ songs }: AlbumContentProps) {
  // Sort songs by track number (assumes track number is at start of title)
  const sortedSongs = [...songs].sort((a, b) => {
    const getTrackNum = (title: string) => parseInt((title ?? '').trim().split(' ')[0], 10) || 0;
    return getTrackNum(a.title ?? '') - getTrackNum(b.title ?? '');
  });
  useSetSongsToState(sortedSongs);

  return (
    <div className="flex w-full flex-col gap-y-2 p-6">
      {sortedSongs.map((song) => (
        <AlbumItem key={song.id} song={song} />
      ))}
    </div>
  );
}

interface AlbumItemProps {
  song: Song;
}

function AlbumItem({ song }: AlbumItemProps) {
  const { setCurrentSong } = usePlayerStoreActions();
  const currentSong = usePlayerCurrentSongSelect();
  const { isPlaying: audioIsPlaying } = useAudioPlayerContext();
  const isCurrent = currentSong?.id === song.id;

  return (
    <div className="flex w-full items-center gap-x-4">
      <div
        onClick={() => setCurrentSong(song)}
        className="flex w-full cursor-pointer items-center justify-between gap-x-3 rounded-md p-2 hover:bg-neutral-800/50"
      >
        <div className="flex flex-col gap-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="truncate text-white">{song.title}</p>
            {isCurrent && (
              <span className="inline-block h-4 w-4">
                <span className="flex h-full items-end gap-[1.5px]">
                  <span className={`w-[2px] h-2 rounded-sm ${audioIsPlaying ? 'animate-bar1' : 'bg-[hsl(var(--primary))]'}`} />
                  <span className={`w-[2px] h-3 rounded-sm ${audioIsPlaying ? 'animate-bar2' : 'bg-[hsl(var(--primary))]'}`} />
                  <span className={`w-[2px] h-4 rounded-sm ${audioIsPlaying ? 'animate-bar3' : 'bg-[hsl(var(--primary))]'}`} />
                </span>
              </span>
            )}
          </div>
          <p className="truncate text-sm text-neutral-400">{song.author}</p>
        </div>
        <p className="truncate text-sm text-neutral-400">
          {formatDuration(song.duration ?? 0)}
        </p>
      </div>
      <LikeButton songId={song.id} />
    </div>
  );
}
// Add keyframes for animated bars
// You can move this to a global CSS file if preferred
import '~/app/globals.css';

// Add the following to your CSS (e.g., globals.css or a module):
// @keyframes bar1 { 0%, 100% { height: 0.5rem; } 50% { height: 1.25rem; } }
// @keyframes bar2 { 0%, 100% { height: 1rem; } 50% { height: 0.75rem; } }
// @keyframes bar3 { 0%, 100% { height: 1.25rem; } 50% { height: 0.5rem; } }
// .animate-bar1 { animation: bar1 1s infinite ease-in-out; }
// .animate-bar2 { animation: bar2 1s infinite ease-in-out 0.2s; }
// .animate-bar3 { animation: bar3 1s infinite ease-in-out 0.4s; }
