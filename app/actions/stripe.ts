'use server'

import { stripe } from '@/lib/stripe'
import { getProduct, isPaidProduct } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function createCheckoutSession(productId: string) {
  const product = getProduct(productId)

  if (!product) {
    return { error: 'Product not found' }
  }

  if (!isPaidProduct(productId)) {
    return { error: 'Cannot checkout free product' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to checkout' }
  }

  try {
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
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return { session }
  } catch (error) {
    console.error('Error retrieving session:', error)
    return { error: 'Failed to retrieve session' }
  }
}

export async function updateSubscriptionStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status !== 'paid') {
      return { error: 'Payment not completed' }
    }

    const userId = session.metadata?.userId
    const productId = session.metadata?.productId

    if (!userId || !productId) {
      return { error: 'Missing metadata' }
    }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: 'pro',
        status: 'active',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error updating subscription:', error)
      return { error: 'Failed to update subscription' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating subscription:', error)
    return { error: 'Failed to update subscription' }
  }
}
