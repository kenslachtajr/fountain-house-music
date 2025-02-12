import { AuthenticationDialogFeature } from '~/features/authentication/authentication-dialog';
import { SubscribeDialogFeature } from '~/features/subscribe/subscribe-dialog';
import { UploadDialogFeature } from '~/features/upload/upload-dialog';
import { getActiveProductsWithPrices } from '~/server/actions/products/get-active-products-with-prices';

export async function IncludeModals() {
  const products = await getActiveProductsWithPrices();
  return (
    <>
      <AuthenticationDialogFeature />
      <SubscribeDialogFeature products={products} />
      <UploadDialogFeature />
    </>
  );
}
