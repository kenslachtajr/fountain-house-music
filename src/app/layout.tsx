import { Metadata, Viewport } from 'next';
import './globals.css';

import { Figtree } from 'next/font/google';

import { PropsWithChildren } from 'react';
import { LayoutFeature } from '~/features/layout/layout';
import { PlayerFeature } from '~/features/player/player';
import { cn } from '~/lib/cn';
import getActiveProductsWithPrices from '~/server/actions/getActiveProductsWithPrices';

const font = Figtree({ subsets: ['latin'] });

const APP_NAME = 'Fountain House Music';
const APP_DEFAULT_TITLE = 'Fountain House Music';
const APP_TITLE_TEMPLATE = '%s - Fountain House Music';
const APP_DESCRIPTION = 'Listen to great music!';

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const revalidate = 0;

export default async function RootLayout({ children }: PropsWithChildren) {
  const products = await getActiveProductsWithPrices();

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body suppressHydrationWarning className={cn('dark', font.className)}>
        <LayoutFeature>{children}</LayoutFeature>
        <PlayerFeature />
      </body>
    </html>
  );
}
