import getActiveProductsWithPrices from '~/server/actions/getActiveProductsWithPrices';
import { Products } from './components/products';

export async function SubscribeFeature() {
  const products = await getActiveProductsWithPrices();
  return <Products products={products} />;
}
