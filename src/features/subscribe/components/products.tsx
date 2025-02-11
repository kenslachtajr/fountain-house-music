'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '~/components/ui/legacy/button';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { getStripe } from '~/lib/get-stripe';
import { Price, ProductWithPrice } from '~/types/types';
import { postData } from '~/utils/post-data';

interface ProductsProps {
  products: ProductWithPrice[];
}

export function Products({ products }: ProductsProps) {
  const user = useCurrentUserSelect();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in');
    }

    if (user?.subscription) {
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

  if (user?.subscription) {
    return <div className="text-center">Already subscribed!</div>;
  }

  if (products.length) {
    return (
      <div className="text-center">
        {products.map((product) => {
          if (!product.prices?.length) return;

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={!user}
              className="mb-4"
            >
              {product.name} <br />
              Subscribe for {formatPrice(price)} a {price.interval}
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
