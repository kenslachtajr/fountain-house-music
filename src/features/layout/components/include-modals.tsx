import { AuthenticationDialogFeature } from '~/features/authentication/authentication-dialog';
import { SubscribeDialogFeature } from '~/features/subscribe/subscribe-dialog';
import { UploadDialogFeature } from '~/features/upload/upload-dialog';
import getActiveProductsWithPrices from '~/server/actions/getActiveProductsWithPrices';

export async function IncludeModals() {
  const products = await getActiveProductsWithPrices();
  return (
    <>
      <AuthenticationDialogFeature />
      <SubscribeDialogFeature />
      <UploadDialogFeature />
    </>
  );
}
