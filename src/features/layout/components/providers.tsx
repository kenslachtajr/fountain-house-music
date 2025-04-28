'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';
import { AudioPlayerProvider } from 'react-use-audio-player';

export function Providers({ children }: PropsWithChildren) {
  return (
    <AudioPlayerProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </AudioPlayerProvider>
  );
}
