import Stripe from 'stripe';
import { shouldNeverHappen } from '~/utils/should-never-happen';

if (!process.env.STRIPE_SECRET_KEY) {
  shouldNeverHappen('STRIPE_SECRET_KEY environment variable is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  appInfo: {
    name: 'Fountain House Studio Streaming App',
    version: '0.1.0',
  },
});
