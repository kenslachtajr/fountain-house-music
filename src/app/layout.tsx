import './globals.css';

import { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { LayoutFeature } from '~/features/layout/layout';
import { cn } from '~/lib/cn';

const font = Figtree({ subsets: ['latin'] });

const APP_NAME = 'Fountain House Music';
const APP_DEFAULT_TITLE = 'Fountain House Music';
const APP_TITLE_TEMPLATE = '%s - Fountain House Music';
const APP_DESCRIPTION = 'Listen to great music!';

export const revalidate = 0;

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body suppressHydrationWarning className={cn('dark', font.className)}>
        <LayoutFeature>{children}</LayoutFeature>
      </body>
    </html>
  );
}

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
