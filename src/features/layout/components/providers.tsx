'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';
import { AudioPlayerProvider } from 'react-use-audio-player';
import { UnifiedAudioProvider } from '~/features/player/hooks/use-unified-audio';

export function Providers({ children }: PropsWithChildren) {
  return (
    <AudioPlayerProvider>
      <UnifiedAudioProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </UnifiedAudioProvider>
    </AudioPlayerProvider>
  );
}
