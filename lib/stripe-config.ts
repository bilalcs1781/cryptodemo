/**
 * Stripe configuration
 * Publishable key is safe to expose on the client side
 */
export const STRIPE_PUBLISHABLE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx";

export const isStripeConfigured = () => {
  return !!STRIPE_PUBLISHABLE_KEY;
};
