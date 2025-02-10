import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import { useCurrentUserFromStore } from '~/hooks/use-current-user';
import { getStripe } from '~/lib/stripeClient';
import { Price, ProductWithPrice } from '~/types/types';
import { postData } from '~/utils/helpers';

interface ProductsProps {
  products: ProductWithPrice[];
}

export function Products({ products }: ProductsProps) {
  const user = useCurrentUserFromStore();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in');
    }

    if (user?.subscriptions) {
      setPriceIdLoading(undefined);
      return toast('Already subscribed!');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (user?.subscriptions) {
    return <div className="text-center">Already subscribed!</div>;
  }

  if (products.length) {
    return (
      <div className="text-center">
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={!user}
              className="mb-4"
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  return <div className="text-center">No products available!</div>;
}

function formatPrice(price: Price) {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || undefined,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
}
