'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { useCurrentUserFromStore } from '~/hooks/use-current-user';
import useSubscribeModal from '~/hooks/useSubscribeModal';
import { getStripe } from '~/lib/stripeClient';
import { Price, ProductWithPrice } from '~/types/types';
import { postData } from '~/utils/helpers';
import Button from './Button';
import Modal from './Modal';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || undefined,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const user = useCurrentUserFromStore();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

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

  let content = <div className="text-center">No products available!</div>;

  if (products.length) {
    content = (
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

  if (user?.subscription) {
    content = <div className="text-center">Already subscribed!</div>;
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen with a paid subscription."
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
