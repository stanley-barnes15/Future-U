'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { updateSubscriptionStatus } from '@/app/actions/stripe'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle2, Loader2, PartyPopper } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (sessionId) {
      updateSubscriptionStatus(sessionId).then((result) => {
        if (result.error) {
          setStatus('error')
        } else {
          setStatus('success')
        }
      })
    } else {
      setStatus('error')
    }
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Future You</span>
          </div>
          
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              </div>
              <CardTitle className="text-xl text-foreground">Processing...</CardTitle>
              <CardDescription className="text-muted-foreground">
                Please wait while we confirm your payment
              </CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-[oklch(0.65_0.18_145)]/20 rounded-full flex items-center justify-center">
                    <PartyPopper className="w-10 h-10 text-[oklch(0.65_0.18_145)]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[oklch(0.65_0.18_145)] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl text-foreground">Welcome to Pro!</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your subscription is now active
              </CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-xl text-foreground">Something went wrong</CardTitle>
              <CardDescription className="text-muted-foreground">
                We couldn&apos;t confirm your payment
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'success' && (
            <>
              <p className="text-sm text-muted-foreground">
                You now have access to all Pro features including 10-year projections, unlimited scenarios, and daily personalized nudges.
              </p>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/pricing">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="border-border text-foreground hover:bg-secondary">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
