import './globals.css';

import { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { LayoutFeature } from '~/features/layout/layout';
import { cn } from '~/lib/cn';
import InstallPrompt from '../components/InstallPrompt';

const font = Figtree({ subsets: ['latin'] });

const APP_NAME = 'Fountain House Music';
const APP_DEFAULT_TITLE = 'Fountain House Music';
const APP_TITLE_TEMPLATE = '%s - Fountain House Music';
const APP_DESCRIPTION = 'Listen to great music!';

export const revalidate = 0;

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/web-app-manifest-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/images/web-app-manifest-192x192.png" />
      </head>
      <body suppressHydrationWarning className={cn('dark', font.className)}>
        <InstallPrompt />
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