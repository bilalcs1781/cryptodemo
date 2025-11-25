/**
 * Stripe configuration
 * Publishable key is safe to expose on the client side
 */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const isStripeConfigured = () => {
  return !!STRIPE_PUBLISHABLE_KEY;
};
