import { ProductWithPrice } from '~/types/types';
import { createClient } from '~/utils/supabase/server';

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .eq('id', 'prod_SzqQwosupsjPWV')
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error);
  }

  return (data ?? []) as ProductWithPrice[];
};
