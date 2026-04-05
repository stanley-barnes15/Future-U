'use client'

import { useCallback, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import { createCheckoutSession } from '@/app/actions/stripe'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || 'pro-monthly'
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    const result = await createCheckoutSession(productId)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
    return result.clientSecret!
  }, [productId])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Future You</span>
            </div>
            <CardTitle className="text-xl text-destructive">Checkout Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/dashboard" className="text-primary hover:underline">
              Return to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8 pt-8">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Future You</span>
        </div>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl text-foreground text-center">
              Complete Your Upgrade
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
