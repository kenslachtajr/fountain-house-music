import { NextResponse } from 'next/server';

import { stripe } from '~/lib/stripe';
import { createOrRetrieveCustomer } from '~/server/actions/stripe/create-or-retrieve-customer';
import { getURL } from '~/utils/get-url';
import { shouldNeverHappen } from '~/utils/should-never-happen';
import { createClient } from '~/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return shouldNeverHappen(
        'No authenticated user found when creating portal link',
      );
    }

    const customer = await createOrRetrieveCustomer({
      uuid: user.id || '',
      email: user.email || '',
    });

    if (!customer) {
      return shouldNeverHappen(
        'Failed to create or retrieve customer for portal link',
      );
    }

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
