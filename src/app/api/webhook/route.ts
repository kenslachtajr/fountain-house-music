import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '~/lib/stripe';
import { manageSubscriptionStatusChange } from '~/server/actions/stripe/manage-subscription-status-change';
import { upsertPriceRecord } from '~/server/actions/stripe/upsert-price-record';
import { upsertProductRecord } from '~/server/actions/stripe/upsert-product-record';
import { shouldNeverHappen } from '~/utils/should-never-happen';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get('Stripe-Signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Missing Stripe webhook secret or signature');
    return new NextResponse('Missing webhook secret or signature', {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔 Webhook received: ${event.type}`);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created',
          );
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true,
            );
          }
          break;
        default:
          shouldNeverHappen(
            `Unhandled Stripe webhook event type: ${event.type}`,
          );
      }
      console.log(`✅ Webhook handled: ${event.type}`);
      return NextResponse.json(
        { received: true, type: event.type },
        { status: 200 },
      );
    } catch (error: any) {
      console.error(`Webhook handler failed: ${error.message}`);
      return new NextResponse(`Webhook handler failed: ${error.message}`, {
        status: 400,
      });
    }
  }

  return NextResponse.json(
    { received: true, type: event.type },
    { status: 200 },
  );
}
