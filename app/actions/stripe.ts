'use server'

import { getStripe } from '@/lib/stripe'
import { getProduct, isPaidProduct } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const checkoutSessionSchema = z.string().min(1)

export async function createCheckoutSession(productId: string) {
  const parsedProduct = z.string().min(1).safeParse(productId)
  if (!parsedProduct.success) {
    return { error: 'Invalid product id' }
  }

  const product = getProduct(parsedProduct.data)

  if (!product) {
    return { error: 'Product not found' }
  }

  if (!isPaidProduct(parsedProduct.data)) {
    return { error: 'Cannot checkout free product' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to checkout' }
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: product.interval !== 'one_time'
              ? { interval: product.interval }
              : undefined,
          },
          quantity: 1,
        },
      ],
      mode: product.interval !== 'one_time' ? 'subscription' : 'payment',
      customer_email: user.email,
      metadata: {
        userId: user.id,
        productId: product.id,
      },
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    return { clientSecret: session.client_secret }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return { error: 'Failed to create checkout session' }
  }
}

export async function getCheckoutSession(sessionId: string) {
  const parsed = checkoutSessionSchema.safeParse(sessionId)
  if (!parsed.success) {
    return { error: 'Invalid session id' }
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(parsed.data)
    return { session }
  } catch (error) {
    console.error('Error retrieving session:', error)
    return { error: 'Failed to retrieve session' }
  }
}
