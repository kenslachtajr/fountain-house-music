'use server';

import Stripe from 'stripe';
import { Product } from '~/types/types';
import { createClient } from '~/utils/supabase/server';

export const upsertProductRecord = async (product: Stripe.Product) => {
  const supabaseAdmin = await createClient();
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabaseAdmin.from('products').upsert([productData]);

  if (error) {
    throw error;
  }

  console.log(`Product inserted/updated: ${product.id}`);
};
