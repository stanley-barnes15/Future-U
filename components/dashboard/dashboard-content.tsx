'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useSubscription } from '@/lib/subscription-context'
import { UpgradeBanner, FeatureLock } from '@/components/upgrade-banner'
import { DailyNudge } from '@/components/dashboard/daily-nudge'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { FutureTimeline } from '@/components/dashboard/future-timeline'
import { ScenarioComparison } from '@/components/dashboard/scenario-comparison'
import { UserNav } from '@/components/dashboard/user-nav'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardContentProps {
  user: User
  profile: {
    id: string
    full_name: string | null
    onboarding_completed: boolean | null
  } | null
  subscription: {
    plan: string
    status: string
  } | null
}

export function DashboardContent({ user, profile, subscription }: DashboardContentProps) {
  const { isPro, plan } = useSubscription()
  const [showOnboarding, setShowOnboarding] = useState(!profile?.onboarding_completed)

  if (showOnboarding) {
    return (
      <OnboardingWizard 
        userId={user.id}
        onComplete={() => setShowOnboarding(false)} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Future You</span>
            {isPro && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                PRO
              </span>
            )}
          </div>
          <UserNav 
            user={user} 
            profile={profile}
            plan={plan}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {!isPro && <UpgradeBanner />}

        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s how your future is shaping up
              </p>
            </div>
          </div>

          {isPro ? (
            <DailyNudge />
          ) : (
            <FeatureLock feature="Daily Personalized Nudges">
              <DailyNudge />
            </FeatureLock>
          )}

          <StatsOverview isPro={isPro} />

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="timeline">Future Timeline</TabsTrigger>
              <TabsTrigger value="scenarios">Scenario Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-6">
              <FutureTimeline isPro={isPro} />
            </TabsContent>
            
            <TabsContent value="scenarios" className="mt-6">
              <ScenarioComparison isPro={isPro} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
