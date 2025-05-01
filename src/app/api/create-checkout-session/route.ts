import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

import { stripe } from '~/lib/stripe';
import { createOrRetrieveCustomer } from '~/server/actions/stripe/create-or-retrieve-customer';
import { getURL } from '~/utils/get-url';
import { createClient } from '~/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { price, quantity = 1, metadata = {} } = await request.json();

    if (!price?.id) {
      return new NextResponse('Price ID is required', { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
      const customer = await createOrRetrieveCustomer({
        uuid: user.id,
        email: user.email || '',
      });

      // Generate a consistent idempotency key based on customer, price, and timestamp (hour-based)
      const timestamp = Math.floor(Date.now() / (60 * 60 * 1000)); // Changes every hour
      const idempotencyKey = createHash('sha256')
        .update(`${customer}-${price.id}-${timestamp}`)
        .digest('hex');

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          customer,
          line_items: [
            {
              price: price.id,
              quantity,
            },
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            metadata,
          },
          success_url: `${getURL()}/account`,
          cancel_url: `${getURL()}`,
        },
        {
          idempotencyKey,
        },
      );

      return NextResponse.json({ sessionId: session.id });
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);
      return new NextResponse(`Stripe error: ${stripeError.message}`, {
        status: stripeError.statusCode || 500,
      });
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse('Internal server error. Please try again later.', {
      status: 500,
    });
  }
}
