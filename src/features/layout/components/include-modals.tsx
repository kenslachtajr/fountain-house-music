import SubscribeModal from '~/components/SubscribeModal';
import { AuthenticationDialogFeature } from '~/features/authentication/authentication-dialog';
import { UploadDialogFeature } from '~/features/upload/upload-dialog';
import { ProductWithPrice } from '~/types/types';

interface IncludeModalsProps {
  products: ProductWithPrice[];
}

export function IncludeModals({ products }: IncludeModalsProps) {
  return (
    <>
      <AuthenticationDialogFeature />
      <SubscribeModal products={products} />
      <UploadDialogFeature />
    </>
  );
}
