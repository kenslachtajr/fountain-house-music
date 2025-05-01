import { stripe } from '~/lib/stripe';
import { shouldNeverHappen } from '~/utils/should-never-happen';
import { createClient } from '~/utils/supabase/server';

export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  if (!uuid) {
    return shouldNeverHappen(
      'User ID is required for customer creation/retrieval',
    );
  }

  const supabaseAdmin = await createClient();

  try {
    // First try to retrieve the customer
    const { data: existingCustomer, error: queryError } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', uuid)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      return shouldNeverHappen(
        `Unexpected database error: ${queryError.message}`,
      );
    }

    if (existingCustomer?.stripe_customer_id) {
      // Verify the customer still exists in Stripe
      try {
        await stripe.customers.retrieve(existingCustomer.stripe_customer_id);
        return existingCustomer.stripe_customer_id;
      } catch (stripeError: any) {
        if (stripeError.code === 'resource_missing') {
          // Customer was deleted in Stripe, we need to create a new one
          // First, clear the old customer ID from our database
          const { error: deleteError } = await supabaseAdmin
            .from('customers')
            .delete()
            .eq('id', uuid);

          if (deleteError) {
            console.error('Failed to delete old customer record:', deleteError);
            // Continue anyway as we'll upsert the new record
          }
        } else {
          throw stripeError;
        }
      }
    }

    // Create a new customer
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      };

    if (email) customerData.email = email;

    const customer = await stripe.customers.create(customerData);
    console.log(
      `Created new Stripe customer: ${customer.id} for user: ${uuid}`,
    );

    const { error: insertError } = await supabaseAdmin
      .from('customers')
      .upsert([{ id: uuid, stripe_customer_id: customer.id }]);

    if (insertError) {
      // If we fail to insert into our database, clean up the Stripe customer
      await stripe.customers.del(customer.id);
      return shouldNeverHappen(
        `Failed to insert customer: ${insertError.message}`,
      );
    }

    console.log(
      `Linked Stripe customer ${customer.id} with user ${uuid} in database`,
    );
    return customer.id;
  } catch (error: any) {
    console.error('Error in createOrRetrieveCustomer:', error);
    return shouldNeverHappen(`Failed to handle customer: ${error.message}`);
  }
};
