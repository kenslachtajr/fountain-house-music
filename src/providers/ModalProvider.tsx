'use client';

import AuthModal from '~/components/AuthModal';
import SubscribeModal from '~/components/SubscribeModal';
import UploadModal from '~/components/UploadModal';
import { useIsMounted } from '~/hooks/use-is-mounted';
import { ProductWithPrice } from '~/types/types';

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
