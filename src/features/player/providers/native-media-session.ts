import { Capacitor } from '@capacitor/core';

type ActionHandlers = {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seekto?: (time: number) => void;
};

let mediaSessionPlugin: typeof import('@capgo/capacitor-media-session') | null =
  null;

async function getPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  if (!mediaSessionPlugin) {
    mediaSessionPlugin = await import('@capgo/capacitor-media-session');
  }
  return mediaSessionPlugin;
}

export async function setNativeMediaMetadata(
  title: string,
  artist: string,
  album: string,
  artworkUrl: string,
) {
  const plugin = await getPlugin();
  if (!plugin) return;

  await plugin.MediaSession.setMetadata({
    title,
    artist,
    album,
    artwork: [{ src: artworkUrl, sizes: '512x512', type: 'image/jpeg' }],
  });
}

export async function setNativePlaybackState(
  state: 'playing' | 'paused' | 'none',
) {
  const plugin = await getPlugin();
  if (!plugin) return;

  await plugin.MediaSession.setPlaybackState({ playbackState: state });
}

export async function setNativeActionHandlers(handlers: ActionHandlers) {
  const plugin = await getPlugin();
  if (!plugin) return;

  await plugin.MediaSession.setActionHandler(
    { action: 'play' },
    handlers.play,
  );
  await plugin.MediaSession.setActionHandler(
    { action: 'pause' },
    handlers.pause,
  );
  await plugin.MediaSession.setActionHandler(
    { action: 'nexttrack' },
    handlers.next,
  );
  await plugin.MediaSession.setActionHandler(
    { action: 'previoustrack' },
    handlers.previous,
  );
  if (handlers.seekto) {
    const seekHandler = handlers.seekto;
    await plugin.MediaSession.setActionHandler(
      { action: 'seekto' },
      (details) => {
        if (details.seekTime != null) {
          seekHandler(details.seekTime);
        }
      },
    );
  }
}

export async function updateNativePositionState(
  duration: number,
  position: number,
  playbackRate: number,
) {
  const plugin = await getPlugin();
  if (!plugin) return;

  await plugin.MediaSession.setPositionState({
    duration,
    position,
    playbackRate,
  });
}
