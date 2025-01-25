import './globals.css';
import { Figtree } from 'next/font/google';

import Player from '~/components/Player';
import Sidebar from '~/components/Sidebar';
import getActiveProductsWithPrices from './actions/getActiveProductsWithPrices';
import getSongsByUserId from './actions/getSongsByUserId';
import ModalProvider from './providers/ModalProvider';
import SupabaseProvider from './providers/SupabaseProvider';
import ToasterProvider from './providers/ToasterProvider';
import UserProvider from './providers/UserProvider';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Fountain Music Streaming App',
  description: 'Listen to great music!',
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products} />
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
