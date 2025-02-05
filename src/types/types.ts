import Stripe from 'stripe';
import { Tables } from './supabase';

// supabase types
export type SupaAlbum = Tables<'albums'>;
export type SupaAlbumWithSongs = Prettify<
  SupaAlbum & {
    songs: SupaSong[];
  }
>;

export type SupaCustomer = Tables<'customers'>;
export type SupaLikedSong = Tables<'liked_songs'>;
export type SupaPrice = Tables<'prices'>;
export type SupaProduct = Tables<'products'>;
export type SupaSong = Tables<'songs'>;
export type SupaSubscription = Tables<'subscriptions'>;
export type SupaUser = Tables<'users'>;

// client types
export type Album = Prettify<
  SupaAlbumWithSongs & {
    duration: number | string;
    readable_duration: string;
    songs_count: number;
  }
>;

export type Song = SupaSong;

export type Product = SupaProduct;

export type Price = Prettify<
  Omit<SupaPrice, 'interval' | 'metadata' | 'products' | 'type'> & {
    interval?: Stripe.Price.Recurring.Interval;
    metadata?: Stripe.Metadata;
    products?: Product;
    type?: Stripe.Price.Type;
  }
>;

export type ProductWithPrice = Prettify<
  Product & {
    prices?: Price[];
  }
>;

export type Subscription = Prettify<
  Omit<SupaSubscription, 'metadata' | 'status'> & {
    metadata?: Stripe.Metadata;
    status?: Stripe.Subscription.Status;
    prices?: Price;
  }
>;

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
  role: 'admin' | 'user';
}

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
