'use client';

import { LikeButton } from '~/components/like-button';
import { usePlayerStoreActions, usePlayerCurrentSongSelect } from '~/features/player/store/player.store';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { Album, Song } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';
import { AlbumCard } from '../../../_components/album-card';

interface ArtistContentProps {
  songs: Song[];
  albums: Album[];
}

export function ArtistContent({ songs, albums }: ArtistContentProps) {
  const { setCurrentSong, setSongs } = usePlayerStoreActions();

  const handlePlayAlbum = (album: Album) => {
    const sorted = sortSongsByTrack(album.songs);
    setSongs(sorted);
    setCurrentSong(sorted[0]);
  };

  return (
    <div className="flex w-full flex-col gap-y-6 p-6">
      {albums.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Albums</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={{ ...album, songs: sortSongsByTrack(album.songs) }}
                onPlayAlbum={handlePlayAlbum}
              />
            ))}
          </div>
        </div>
      )}

      {songs.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Songs</h2>
          <div className="flex w-full flex-col gap-y-2">
            {songs.map((song) => (
              <ArtistSongItem key={song.id} song={song} allSongs={songs} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArtistSongItem({ song, allSongs }: { song: Song; allSongs: Song[] }) {
  const { setCurrentSong, setSongs } = usePlayerStoreActions();
  const currentSong = usePlayerCurrentSongSelect();
  const { isPlaying: audioIsPlaying } = useAudioPlayerContext();
  const isCurrent = currentSong?.id === song.id;

  const handleClick = () => {
    setSongs(allSongs);
    setCurrentSong(song);
  };

  return (
    <div className="flex w-full items-center gap-x-4">
      <div
        onClick={handleClick}
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
          <p className="truncate text-sm text-neutral-400">{song.album}</p>
        </div>
        <p className="truncate text-sm text-neutral-400">
          {formatDuration(song.duration ?? 0)}
        </p>
      </div>
      <LikeButton songId={song.id} />
    </div>
  );
}

function sortSongsByTrack(songs: Song[]) {
  return [...songs].sort((a, b) => {
    const getTrackNum = (title: string) => parseInt((title ?? '').trim().split(' ')[0], 10) || 0;
    return getTrackNum(a.title ?? '') - getTrackNum(b.title ?? '');
  });
}
