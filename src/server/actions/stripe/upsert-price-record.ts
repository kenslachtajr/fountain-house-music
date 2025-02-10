import Stripe from 'stripe';
import { Price } from '~/types/types';
import { createClient } from '~/utils/supabase/server';

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const supabaseAdmin = await createClient();
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname,
    type: price.type,
    unit_amount: price.unit_amount,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from('prices').upsert([priceData]);

  if (error) {
    throw error;
  }

  console.log(`Price inserted/updated ${price.id}`);
};
