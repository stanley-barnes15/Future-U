'use client'

import { useSubscription } from '@/lib/subscription-context'
import { Button } from '@/components/ui/button'
import { Crown, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function UpgradeBanner() {
  const { isPro } = useSubscription()

  if (isPro) return null

  return (
    <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Crown className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">Unlock Your Full Future</p>
          <p className="text-sm text-muted-foreground">
            Get 10-year projections, unlimited scenarios, and daily insights
          </p>
        </div>
      </div>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
        <Link href="/pricing">
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Link>
      </Button>
    </div>
  )
}

export function FeatureLock({ 
  feature, 
  children 
}: { 
  feature: string
  children: React.ReactNode 
}) {
  const { isPro } = useSubscription()

  if (isPro) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">{feature}</p>
        <p className="text-xs text-muted-foreground">Upgrade to Pro to unlock</p>
        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/pricing">Upgrade</Link>
        </Button>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  )
}
