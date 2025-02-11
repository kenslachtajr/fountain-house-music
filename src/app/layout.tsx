import { Metadata, Viewport } from 'next';
import './globals.css';

import { Figtree } from 'next/font/google';

import { PropsWithChildren } from 'react';
import Sidebar from '~/components/Sidebar';
import { PlayerFeature } from '~/features/player/player';
import ModalProvider from '~/providers/ModalProvider';
import SupabaseProvider from '~/providers/SupabaseProvider';
import ToasterProvider from '~/providers/ToasterProvider';
import UserProvider from '~/providers/UserProvider';
import getActiveProductsWithPrices from '~/server/actions/getActiveProductsWithPrices';
import getSongsByUserId from '~/server/actions/getSongsByUserId';
import { NavigationFeature } from '~/features/navigation/navigation';

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
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <head />
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products} />
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <div className="fixed bottom-0 w-full">
              <PlayerFeature />
              <NavigationFeature/>
            </div>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
