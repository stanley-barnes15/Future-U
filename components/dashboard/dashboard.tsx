'use client'

import { useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { calculateProjections, formatCurrency, generateDailyNudge } from '@/lib/projection-engine'
import { FutureTimeline } from './future-timeline'
import { StatsOverview } from './stats-overview'
import { DailyNudge } from './daily-nudge'
import { ScenarioComparison } from './scenario-comparison'
import { SettingsIcon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { profile, resetApp } = useAppStore()
  
  const projections = useMemo(() => {
    if (!profile) return []
    return calculateProjections(profile, [1, 5, 10])
  }, [profile])
  
  const dailyNudge = useMemo(() => {
    if (!profile) return null
    return generateDailyNudge(profile)
  }, [profile])
  
  if (!profile) return null
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Future You</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {profile.name || 'Explorer'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={resetApp}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Daily Nudge */}
        {dailyNudge && <DailyNudge nudge={dailyNudge} />}
        
        {/* Stats Overview */}
        <StatsOverview profile={profile} projections={projections} />
        
        {/* Future Timeline - Main Feature */}
        <FutureTimeline projections={projections} profile={profile} />
        
        {/* Scenario Comparison */}
        <ScenarioComparison profile={profile} />
      </main>
    </div>
  )
}
