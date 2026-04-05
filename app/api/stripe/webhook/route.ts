import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

async function upsertSubscriptionFromSession(session: {
  metadata?: { userId?: string; productId?: string } | null
  customer: string | null
  subscription: string | null
}) {
  const userId = session.metadata?.userId
  const productId = session.metadata?.productId
  if (!userId || !productId) return

  const supabase = await createClient()
  await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan: 'pro',
        status: 'active',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      },
      { onConflict: 'user_id' },
    )
}

export async function POST(request: Request) {
  const signature = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return new Response('Missing webhook configuration', { status: 400 })
  }

  const payload = await request.text()

  try {
    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      await upsertSubscriptionFromSession({
        metadata: session.metadata,
        customer: session.customer as string | null,
        subscription: session.subscription as string | null,
      })
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      const supabase = await createClient()
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id)
    }

    return new Response('ok', { status: 200 })
  } catch (error) {
    console.error('Stripe webhook error', error)
    return new Response('Webhook error', { status: 400 })
  }
}
