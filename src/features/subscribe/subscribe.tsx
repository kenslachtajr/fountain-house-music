import { ProductWithPrice } from '~/types/types';
import { Products } from './components/products';

interface SubscribeFeatureProps {
  products: ProductWithPrice[];
}

export function SubscribeFeature({ products }: SubscribeFeatureProps) {
  return <Products products={products} />;
}
