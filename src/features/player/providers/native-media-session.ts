import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import type { MediaSessionAction } from '@capgo/capacitor-media-session';

type ActionHandlers = {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seekto?: (time: number) => void;
};

type ActionHandlerEvent = {
  action: MediaSessionAction;
  seekTime?: number | null;
};

// The native plugin only exposes `setMetadata`/`setPlaybackState`/etc. in its
// TS definitions, but every Capacitor plugin proxy also implements
// `addListener` at runtime (see @capacitor/core's registerPlugin). We type it
// here ourselves since the plugin's own .d.ts omits it.
type MediaSessionPluginWithEvents =
  typeof import('@capgo/capacitor-media-session')['MediaSession'] & {
    addListener(
      eventName: 'actionHandler',
      listener: (event: ActionHandlerEvent) => void,
    ): Promise<PluginListenerHandle>;
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

// The native plugin's `setActionHandler` only registers the command target
// on the native side (it's a CAPPluginReturnPromise method, so the JS
// `handler` argument passed to it is never actually invoked). Native events
// arrive later via a single `notifyListeners('actionHandler', ...)` call, so
// we subscribe once here and dispatch to whichever handlers were most
// recently registered.
let currentHandlers: ActionHandlers | null = null;
let listenerAttached = false;

async function ensureActionListener() {
  const plugin = await getPlugin();
  if (!plugin || listenerAttached) return;
  listenerAttached = true;

  const mediaSession = plugin.MediaSession as MediaSessionPluginWithEvents;
  await mediaSession.addListener('actionHandler', (details) => {
    if (!currentHandlers) return;

    switch (details.action) {
      case 'play':
        currentHandlers.play();
        break;
      case 'pause':
        currentHandlers.pause();
        break;
      case 'nexttrack':
        currentHandlers.next();
        break;
      case 'previoustrack':
        currentHandlers.previous();
        break;
      case 'seekto':
        if (details.seekTime != null) {
          currentHandlers.seekto?.(details.seekTime);
        }
        break;
      default:
        break;
    }
  });
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

  // Keep the latest handlers for the shared `actionHandler` listener to
  // dispatch to (see ensureActionListener above).
  currentHandlers = handlers;
  await ensureActionListener();

  await plugin.MediaSession.setActionHandler({ action: 'play' }, null);
  await plugin.MediaSession.setActionHandler({ action: 'pause' }, null);
  await plugin.MediaSession.setActionHandler({ action: 'nexttrack' }, null);
  await plugin.MediaSession.setActionHandler(
    { action: 'previoustrack' },
    null,
  );
  if (handlers.seekto) {
    await plugin.MediaSession.setActionHandler({ action: 'seekto' }, null);
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
