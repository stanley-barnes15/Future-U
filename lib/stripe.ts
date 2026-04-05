import 'server-only'

import Stripe from 'stripe'

export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  return new Stripe(apiKey)
}
