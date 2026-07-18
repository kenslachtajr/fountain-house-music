'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SimpleSlider } from '~/components/ui/slider';
import { useLoadImage } from '~/hooks/use-load-image';
import { createClient } from '~/utils/supabase/client';
import { isNativeApp } from '~/utils/platform';
import { PlayerControls } from './components/player-controls';
import { PlayerDetails } from './components/player-details';
import { PlayerSettings } from './components/player-settings';
import { useAudioTime } from './hooks/use-audio-time';
import { useUnifiedAudio } from './hooks/use-unified-audio';
import { useLoadSongUrl } from './hooks/use-load-song-url';
import {
  setNativeMediaMetadata,
  setNativePlaybackState,
  setNativeActionHandlers,
  updateNativePositionState,
} from './providers/native-media-session';
import {
  usePlayerCurrentSongSelect,
  usePlayerSongsSelect,
  usePlayerStoreActions,
  getPlayerState,
} from './store/player.store';
import {
  MediaSessionDebugOverlay,
  recordMediaSessionAction,
  recordMediaSessionState,
} from './components/media-session-debug';

// iOS restricts decoding new remote images once the page is backgrounded or
// locked, so setting MediaMetadata artwork to a URL that hasn't already been
// decoded shows as a blank box on the lock screen after the proactive
// auto-advance workaround (further down) fires there. This caches each
// track's artwork as an already-decoded data: URL, keyed by the Supabase
// public URL, so MediaMetadata can be set from data already resident in
// memory instead of a URL requiring a fresh fetch + decode.
const decodedArtworkCache = new Map<string, string>();

// iOS only ever renders one artwork size on the lock screen regardless of
// how many are provided, and multi-megabyte/multi-thousand-pixel source
// images (some album covers here are 3000px+, several MB) appear to fail
// that render entirely rather than just being downscaled. Resizing to a
// fixed, small target here avoids depending on iOS to do that resize
// itself.
const ARTWORK_TARGET_SIZE = 512;

async function decodeArtwork(url: string): Promise<string | null> {
  if (decodedArtworkCache.has(url)) return decodedArtworkCache.get(url)!;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = ARTWORK_TARGET_SIZE;
    canvas.height = ARTWORK_TARGET_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(
      bitmap,
      0,
      0,
      bitmap.width,
      bitmap.height,
      0,
      0,
      ARTWORK_TARGET_SIZE,
      ARTWORK_TARGET_SIZE,
    );
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    decodedArtworkCache.set(url, dataUrl);
    return dataUrl;
  } catch (err) {
    console.error('[MediaSession] artwork decode failed:', err);
    return null;
  }
}

export function PlayerFeature() {
  const { load, seek, play, pause, isPlaying, setVolume } = useUnifiedAudio();
  const { nextSong, previousSong, setSongs } = usePlayerStoreActions();

  const currentSong = usePlayerCurrentSongSelect();
  const songs = usePlayerSongsSelect();
  const songUrl = useLoadSongUrl(currentSong);
  const songImage = useLoadImage(currentSong);
  const [artworkForMetadata, setArtworkForMetadata] = useState<string | null>(
    null,
  );

  const loadRef = useRef(load);
  const setVolumeRef = useRef(setVolume);
  const nextSongRef = useRef(nextSong);
  const currentSongRef = useRef(currentSong);
  // Tracks which song id has already triggered an advance, shared between
  // the "ended" event handler below and the proactive lock-screen workaround
  // further down, so a track can only ever advance once regardless of which
  // path notices it finished first.
  const advancedForSongRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);
  useEffect(() => {
    setVolumeRef.current = setVolume;
  }, [setVolume]);
  useEffect(() => {
    nextSongRef.current = nextSong;
  }, [nextSong]);
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  const handleEnded = useCallback(() => {
    const songId = currentSongRef.current?.id;
    if (songId && advancedForSongRef.current === songId) return;
    advancedForSongRef.current = songId;
    nextSongRef.current();
  }, []);

  useEffect(() => {
    recordMediaSessionState({ hasMediaSession: !!navigator?.mediaSession });
    if (!navigator?.mediaSession) return;

    // iOS Safari only shows the "nexttrack"/"previoustrack" lock-screen
    // buttons if those handlers are registered after playback has actually
    // started; registering them at mount time (before the first play)
    // makes it silently fall back to its default +/-10s skip buttons
    // instead, even though the handlers are set correctly. Re-registering
    // once isPlaying flips true is a widely-confirmed workaround.
    if (!isPlaying) return;

    navigator.mediaSession.setActionHandler('play', () => {
      recordMediaSessionAction('play');
      play();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      recordMediaSessionAction('pause');
      pause();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      recordMediaSessionAction('nexttrack');
      nextSong();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      recordMediaSessionAction('previoustrack');
      previousSong();
    });
    navigator.mediaSession.setActionHandler('seekto', (s) => {
      recordMediaSessionAction(`seekto:${s.seekTime}`);
      if (s.seekTime != null) seek(s.seekTime);
    });
  }, [isPlaying, play, pause, nextSong, previousSong, seek]);

  useEffect(() => {
    if (!songImage) {
      setArtworkForMetadata(null);
      return;
    }

    let cancelled = false;
    decodeArtwork(songImage).then((decoded) => {
      if (!cancelled) setArtworkForMetadata(decoded ?? songImage);
    });

    return () => {
      cancelled = true;
    };
  }, [songImage]);

  useEffect(() => {
    if (!currentSong || !artworkForMetadata) return;
    if (!navigator?.mediaSession) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title ?? '',
      artist: currentSong.author ?? '',
      album: currentSong.album ?? '',
      artwork: [
        { src: artworkForMetadata, sizes: '512x512', type: 'image/jpeg' },
      ],
    });
    recordMediaSessionState({
      metadataTitle: currentSong.title ?? '',
      metadataArtwork: artworkForMetadata,
    });
  }, [currentSong, artworkForMetadata]);

  useEffect(() => {
    if (isNativeApp() || !currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const next = songs.at(currentIndex + 1);
    if (!next?.image_path) return;

    const { data } = createClient()
      .storage.from('images')
      .getPublicUrl(next.image_path);
    if (!data.publicUrl) return;

    decodeArtwork(data.publicUrl);
  }, [currentSong, songs]);

  useEffect(() => {
    if (isNativeApp() || !currentSong || songs.length === 0) return;
    if (typeof window === 'undefined' || !('caches' in window)) return;

    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const next = songs.at(currentIndex + 1);
    if (!next?.song_path) return;

    const { data } = createClient()
      .storage.from('songs')
      .getPublicUrl(next.song_path);
    if (!data.publicUrl) return;

    // Auto-advance triggers nextSong() -> a brand-new <audio> src -> a
    // network fetch that has to finish before .play() can be called, all
    // while the page may already be locked. If that fetch is still pending
    // when iOS suspends the page's JS, playback stalls until the next
    // unlock resumes it (matches the "sometimes waits for unlock" reports).
    // sw.ts registers a runtime cache for audio file extensions, but it's
    // populated on first request rather than ahead of time; fetching the
    // next track's URL here while still in the foreground warms that cache
    // so the real fetch during lock resolves locally instead of over the
    // network.
    fetch(data.publicUrl).catch(() => {});
  }, [currentSong, songs]);

  useEffect(() => {
    if (!currentSong || !songImage) return;
    if (!isNativeApp()) return;

    setNativeMediaMetadata(
      currentSong.title ?? '',
      currentSong.author ?? '',
      currentSong.album ?? '',
      songImage,
    );
    setNativeActionHandlers({
      play: () => play(),
      pause: () => pause(),
      next: () => nextSong(),
      previous: () => previousSong(),
      seekto: (time: number) => seek(time),
    });
  }, [currentSong, songImage, play, pause, nextSong, previousSong, seek]);

  useEffect(() => {
    if (isNativeApp()) {
      setNativePlaybackState(isPlaying ? 'playing' : 'paused');
    } else if (navigator?.mediaSession) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
    recordMediaSessionState({
      playbackState: isPlaying ? 'playing' : 'paused',
      isPlaying,
    });
  }, [isPlaying]);

  const { duration, getPosition } = useUnifiedAudio();

  useEffect(() => {
    if (!isPlaying) return;

    if (isNativeApp()) {
      const interval = setInterval(() => {
        const pos = getPosition();
        updateNativePositionState(duration, pos, 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    // Safari's lock-screen/Control Center scrubber and time labels rely on
    // setPositionState; without it the transport UI has no duration/position
    // to render (this mirrors the native fix for the same underlying gap).
    if (!navigator?.mediaSession?.setPositionState) return;
    if (!duration || !isFinite(duration)) return;

    const interval = setInterval(() => {
      const pos = getPosition();
      try {
        navigator.mediaSession.setPositionState({
          duration,
          position: Math.min(pos, duration),
          playbackRate: 1,
        });
        recordMediaSessionState({ duration, position: pos });
      } catch (_) {}

      // iOS suspends a backgrounded/locked tab's JS runloop shortly after
      // audio goes silent, which means <audio>'s "ended" event frequently
      // never fires once the screen is locked (this is a long-standing,
      // widely-reported WebKit limitation affecting every iOS browser,
      // Chrome included, since they all run on WebKit). This interval is
      // already proven to keep running while locked (it drives the working
      // lock-screen scrubber), so use it to advance the track proactively,
      // just before the current one actually ends, instead of waiting on
      // "ended" to fire. Guarded per-song so it can only fire once even if
      // "ended" also ends up firing normally.
      if (
        currentSong &&
        advancedForSongRef.current !== currentSong.id &&
        pos >= duration - 0.5
      ) {
        advancedForSongRef.current = currentSong.id;
        nextSongRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, getPosition, currentSong]);

  useEffect(() => {
    if (!songUrl) {
      return;
    }

    const userVolume = parseFloat(
      localStorage.getItem('player-volume') || '0.7',
    );
    setVolumeRef.current(userVolume);

    loadRef.current(songUrl, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onend: handleEnded,
    });
  }, [songUrl]);

  if (!currentSong) return null;

  return (
    <div className="h-20 w-full bg-black">
      <MediaSessionDebugOverlay />
      <SeekSlider />
      <div className="px-4 py-2">
        <div className="grid h-full grid-cols-2 md:grid-cols-3">
          <PlayerDetails />
          <PlayerControls />
          <PlayerSettings />
        </div>
      </div>
    </div>
  );
}

function SeekSlider() {
  const time = useAudioTime();
  const { duration, play, pause, seek, isPlaying } = useUnifiedAudio();
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const wasPlayingRef = useRef(false);

  const displayValue = dragging ? dragValue : (time / duration) * 100;

  return (
    <SimpleSlider
      max={100}
      step={0.1}
      minStepsBetweenThumbs={1}
      value={isNaN(displayValue) || !duration ? 0 : displayValue}
      onValueChange={(value) => {
        if (!dragging) {
          wasPlayingRef.current = isPlaying;
          pause();
          setDragging(true);
        }
        setDragValue(value);
      }}
      onValueCommit={(value) => {
        seek(value * (duration / 100));
        setDragging(false);
        if (wasPlayingRef.current) {
          play();
        }
      }}
    />
  );
}
