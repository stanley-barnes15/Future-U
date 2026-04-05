'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Check, ArrowLeft, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const router = useRouter()
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  const handleSelectPlan = (productId: string) => {
    if (productId === 'free') {
      router.push('/auth/sign-up')
    } else {
      router.push(`/checkout?product=${productId}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-foreground">Future You</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Choose Your Path to the Future
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Start free and upgrade anytime to unlock the full potential of your future projections.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingInterval('month')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              billingInterval === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              billingInterval === 'year'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Yearly
            <span className="ml-2 text-xs bg-[oklch(0.65_0.18_145)] text-primary-foreground px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">{PRODUCTS[0].name}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {PRODUCTS[0].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3">
                {PRODUCTS[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary"
                onClick={() => handleSelectPlan('free')}
              >
                Get Started Free
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-card/80 backdrop-blur-sm border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                {billingInterval === 'month' ? PRODUCTS[1].name : PRODUCTS[2].name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {billingInterval === 'month' ? PRODUCTS[1].description : PRODUCTS[2].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  ${billingInterval === 'month' ? '9.99' : '99.99'}
                </span>
                <span className="text-muted-foreground">
                  /{billingInterval === 'month' ? 'month' : 'year'}
                </span>
                {billingInterval === 'year' && (
                  <p className="text-sm text-[oklch(0.65_0.18_145)] mt-1">
                    That&apos;s just $8.33/month
                  </p>
                )}
              </div>
              <ul className="space-y-3">
                {(billingInterval === 'month' ? PRODUCTS[1] : PRODUCTS[2]).features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleSelectPlan(billingInterval === 'month' ? 'pro-monthly' : 'pro-yearly')}
              >
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
