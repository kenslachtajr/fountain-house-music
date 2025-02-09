'use client';

import SubscribeModal from '~/components/SubscribeModal';
import UploadModal from '~/components/UploadModal';
import { AuthenticationFeature } from '~/features/authentication/authentication';
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
      <UploadModal />
      <SubscribeModal products={products} />
      <AuthenticationFeature />
    </>
  );
};

export default ModalProvider;
