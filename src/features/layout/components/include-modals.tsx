import SubscribeModal from '~/components/SubscribeModal';
import UploadModal from '~/components/UploadModal';
import { AuthenticationDialogFeature } from '~/features/authentication/authentication-dialog';
import { ProductWithPrice } from '~/types/types';

interface IncludeModalsProps {
  products: ProductWithPrice[];
}

export function IncludeModals({ products }: IncludeModalsProps) {
  return (
    <>
      <UploadModal />
      <SubscribeModal products={products} />
      <AuthenticationDialogFeature />
    </>
  );
}
