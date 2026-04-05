'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { compareScenarios, formatCurrency } from '@/lib/projection-engine'
import type { UserProfile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { FeatureLock } from '@/components/upgrade-banner'
import { GitCompare, ArrowUp, ArrowDown, TrendingUp, Dumbbell, Moon, Lock } from 'lucide-react'

interface ScenarioComparisonProps {
  isPro: boolean
}

export function ScenarioComparison({ isPro }: ScenarioComparisonProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [scenariosUsed, setScenariosUsed] = useState(0)
  const maxFreeScenarios = 2
  
  const [adjustments, setAdjustments] = useState({
    savingsChange: 0,
    exerciseChange: 0,
    sleepChange: 0,
  })
  
  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return
      
      const { data: habits } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (habits) {
        const userProfile: UserProfile = {
          id: user.id,
          name: '',
          currentAge: habits.current_age || 25,
          monthlyIncome: habits.monthly_income || 3000,
          monthlySavings: habits.monthly_savings || 500,
          savingsGoal: habits.savings_goal || 100000,
          exerciseFrequency: habits.exercise_frequency || 3,
          sleepHours: habits.sleep_hours || 7,
          goals: [],
          habits: [],
          createdAt: new Date(),
        }
        setProfile(userProfile)
      }
      
      setLoading(false)
    }
    
    loadData()
  }, [])
  
  const comparison = useMemo(() => {
    if (!profile) return null
    return compareScenarios(profile, adjustments, [1, 5, 10])
  }, [profile, adjustments])
  
  const handleAdjustment = (key: keyof typeof adjustments, value: number) => {
    // For free users, track scenario changes
    if (!isPro) {
      const newAdjustments = { ...adjustments, [key]: value }
      const hasChanges = newAdjustments.savingsChange !== 0 || 
                         newAdjustments.exerciseChange !== 0 || 
                         newAdjustments.sleepChange !== 0
      
      if (hasChanges && scenariosUsed >= maxFreeScenarios) {
        return // Block further changes
      }
      
      if (hasChanges && adjustments[key] === 0) {
        setScenariosUsed(prev => prev + 1)
      }
    }
    
    setAdjustments({ ...adjustments, [key]: value })
  }
  
  if (loading || !profile || !comparison) {
    return (
      <Card className="border-border/50">
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading scenarios...</div>
        </CardContent>
      </Card>
    )
  }
  
  const tenYearBaseline = comparison.baseline.find((p) => p.year === 10)
  const tenYearAdjusted = comparison.adjusted.find((p) => p.year === 10)
  
  if (!tenYearBaseline || !tenYearAdjusted) return null
  
  const savingsDiff = tenYearAdjusted.finances.totalSavings - tenYearBaseline.finances.totalSavings
  const healthDiff = tenYearAdjusted.health.score - tenYearBaseline.health.score
  
  const hasChanges = adjustments.savingsChange !== 0 || 
                     adjustments.exerciseChange !== 0 || 
                     adjustments.sleepChange !== 0
  
  const isLimitReached = !isPro && scenariosUsed >= maxFreeScenarios
  
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              Scenario Comparison
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              See how small changes today create big differences tomorrow
            </p>
          </div>
          {!isPro && (
            <Badge variant="secondary" className="gap-1">
              {scenariosUsed}/{maxFreeScenarios} scenarios used
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Adjustment controls */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Extra Monthly Savings
              </Label>
              <Badge variant={adjustments.savingsChange > 0 ? 'default' : 'secondary'}>
                {adjustments.savingsChange >= 0 ? '+' : ''}${adjustments.savingsChange}
              </Badge>
            </div>
            <Slider
              value={[adjustments.savingsChange]}
              onValueChange={([value]) => handleAdjustment('savingsChange', value)}
              min={-300}
              max={500}
              step={50}
              disabled={isLimitReached && adjustments.savingsChange === 0}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-$300</span>
              <span>+$500</span>
            </div>
          </div>
          
          <div className="space-y-3 relative">
            {!isPro && (
              <div className="absolute -top-1 -right-1">
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-chart-4" />
                Exercise Frequency
              </Label>
              <Badge variant={adjustments.exerciseChange > 0 ? 'default' : 'secondary'}>
                {adjustments.exerciseChange >= 0 ? '+' : ''}{adjustments.exerciseChange}x/wk
              </Badge>
            </div>
            <Slider
              value={[adjustments.exerciseChange]}
              onValueChange={([value]) => handleAdjustment('exerciseChange', value)}
              min={-3}
              max={4}
              step={1}
              disabled={!isPro || (isLimitReached && adjustments.exerciseChange === 0)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-3x</span>
              <span>+4x</span>
            </div>
          </div>
          
          <div className="space-y-3 relative">
            {!isPro && (
              <div className="absolute -top-1 -right-1">
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-chart-2" />
                Sleep Hours
              </Label>
              <Badge variant={adjustments.sleepChange > 0 ? 'default' : 'secondary'}>
                {adjustments.sleepChange >= 0 ? '+' : ''}{adjustments.sleepChange}hrs
              </Badge>
            </div>
            <Slider
              value={[adjustments.sleepChange]}
              onValueChange={([value]) => handleAdjustment('sleepChange', value)}
              min={-2}
              max={2}
              step={0.5}
              disabled={!isPro || (isLimitReached && adjustments.sleepChange === 0)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-2hrs</span>
              <span>+2hrs</span>
            </div>
          </div>
        </div>
        
        {isLimitReached && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-center">
            <span className="text-muted-foreground">You&apos;ve used all free scenario comparisons. </span>
            <a href="/pricing" className="text-primary hover:underline font-medium">
              Upgrade to Pro for unlimited scenarios
            </a>
          </div>
        )}
        
        {/* Results comparison */}
        {isPro ? (
          <motion.div
            initial={false}
            animate={{ opacity: hasChanges ? 1 : 0.5 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Current path */}
            <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <h4 className="font-semibold text-muted-foreground">Current Path</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">10-Year Savings</p>
                  <p className="text-2xl font-bold">{formatCurrency(tenYearBaseline.finances.totalSavings)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-bold">{tenYearBaseline.health.score}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passive Income</p>
                  <p className="text-xl font-bold">{formatCurrency(tenYearBaseline.finances.monthlyPassiveIncome)}/mo</p>
                </div>
              </div>
            </div>
            
            {/* Adjusted path */}
            <div className={`p-4 rounded-xl border ${hasChanges ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-muted/30'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-primary' : 'bg-muted-foreground'}`} />
                <h4 className={`font-semibold ${hasChanges ? 'text-primary' : 'text-muted-foreground'}`}>
                  Adjusted Path
                </h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">10-Year Savings</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{formatCurrency(tenYearAdjusted.finances.totalSavings)}</p>
                    {savingsDiff !== 0 && (
                      <Badge variant={savingsDiff > 0 ? 'default' : 'destructive'} className="gap-1">
                        {savingsDiff > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {formatCurrency(Math.abs(savingsDiff))}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{tenYearAdjusted.health.score}%</p>
                    {healthDiff !== 0 && (
                      <Badge variant={healthDiff > 0 ? 'default' : 'destructive'} className="gap-1">
                        {healthDiff > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(healthDiff)}pts
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passive Income</p>
                  <p className="text-xl font-bold">{formatCurrency(tenYearAdjusted.finances.monthlyPassiveIncome)}/mo</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <FeatureLock feature="Full Scenario Comparison">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/50 bg-muted/30 h-[200px]" />
              <div className="p-4 rounded-xl border border-border/50 bg-muted/30 h-[200px]" />
            </div>
          </FeatureLock>
        )}
        
        {/* Impact message */}
        {hasChanges && isPro && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/20"
          >
            <p className="text-sm">
              <span className="font-semibold text-primary">Impact Summary: </span>
              {savingsDiff > 0 && (
                <span>
                  By saving {formatCurrency(adjustments.savingsChange)} more per month, you&apos;ll have{' '}
                  <span className="font-bold text-primary">{formatCurrency(savingsDiff)} more</span> in 10 years.{' '}
                </span>
              )}
              {savingsDiff < 0 && (
                <span>
                  Reducing savings by {formatCurrency(Math.abs(adjustments.savingsChange))}/month means{' '}
                  <span className="font-bold text-destructive">{formatCurrency(Math.abs(savingsDiff))} less</span> in 10 years.{' '}
                </span>
              )}
              {healthDiff !== 0 && (
                <span>
                  Your health score would be{' '}
                  <span className={`font-bold ${healthDiff > 0 ? 'text-[oklch(0.65_0.18_145)]' : 'text-destructive'}`}>
                    {Math.abs(healthDiff)} points {healthDiff > 0 ? 'higher' : 'lower'}
                  </span>.
                </span>
              )}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
