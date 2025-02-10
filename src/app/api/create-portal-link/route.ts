import { NextResponse } from 'next/server';

import { stripe } from '~/lib/stripe';
import { createOrRetrieveCustomer } from '~/lib/supabaseAdmin';
import { getURL } from '~/utils/get-url';
import { createClient } from '~/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Could not get user');

    const customer = await createOrRetrieveCustomer({
      uuid: user.id || '',
      email: user.email || '',
    });

    if (!customer) throw new Error('Could not get customer');

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
