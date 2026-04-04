'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';
import { UnifiedAudioProvider } from '~/features/player/hooks/use-unified-audio';

export function Providers({ children }: PropsWithChildren) {
  return (
    <UnifiedAudioProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </UnifiedAudioProvider>
  );
}
