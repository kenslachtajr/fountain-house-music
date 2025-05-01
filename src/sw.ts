import { defaultCache } from '@serwist/next/worker';
import type {
  PrecacheEntry,
  RuntimeCaching,
  SerwistGlobalConfig,
} from 'serwist';
import { Serwist } from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    clients: Clients;
  }
}

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'audio-cache';
const MAX_ENTRIES = 50;

const audioCache: RuntimeCaching = {
  // Cache audio files with a network-first strategy
  matcher: ({ url }: { url: URL }) =>
    url.pathname.match(/\.(mp3|wav|ogg|m4a)$/) !== null,
  handler: {
    handle: async ({ request }) => {
      const cache = await caches.open(CACHE_NAME);

      // Clean up old entries
      const keys = await cache.keys();
      if (keys.length > MAX_ENTRIES) {
        const oldestKey = keys[0];
        await cache.delete(oldestKey);
      }

      try {
        // Try network first
        const response = await fetch(request);
        const clonedResponse = response.clone();
        await cache.put(request, clonedResponse);
        return response;
      } catch (error) {
        // If network fails, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    },
  },
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...defaultCache, audioCache],
});

// Handle visibility changes
self.addEventListener('visibilitychange', () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'VISIBILITY_CHANGE',
        hidden: document.hidden,
      });
    });
  });
});

// Keep the service worker alive when playing audio
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.url.match(/\.(mp3|wav|ogg|m4a)$/)) {
    // Extend the service worker's lifetime
    if (event.request.headers.get('range')) {
      event.waitUntil(
        Promise.race([
          new Promise((resolve) => setTimeout(resolve, 30000)), // 30 second timeout
          fetch(event.request),
        ]),
      );
    }
  }
});

serwist.addEventListeners();
