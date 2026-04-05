'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, generateProjections } from '@/lib/projection-engine'
import type { Projection, UserProfile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { FeatureLock } from '@/components/upgrade-banner'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from 'recharts'
import { TrendingUp, Heart, Target, Calendar, Lock } from 'lucide-react'

interface FutureTimelineProps {
  isPro: boolean
}

export function FutureTimeline({ isPro }: FutureTimelineProps) {
  const [selectedYear, setSelectedYear] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'finances' | 'health' | 'overview'>('overview')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [projections, setProjections] = useState<Projection[]>([])
  const [loading, setLoading] = useState(true)
  
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
        
        // Generate projections based on plan
        const years = isPro ? [1, 5, 10] : [1]
        setProjections(generateProjections(userProfile, years))
      }
      
      setLoading(false)
    }
    
    loadData()
  }, [isPro])
  
  const selectedProjection = projections.find((p) => p.year === selectedYear)
  
  // Generate detailed year-by-year data for charts
  const detailedFinanceData = useMemo(() => {
    if (!profile) return []
    
    const maxYear = isPro ? 10 : 1
    const data = []
    for (let year = 0; year <= maxYear; year++) {
      const monthlyContribution = profile.monthlySavings
      const annualContribution = monthlyContribution * 12
      const rate = 0.07
      
      const totalSavings = annualContribution * ((Math.pow(1 + rate, year) - 1) / rate)
      
      data.push({
        year: `Year ${year}`,
        yearNum: year,
        savings: Math.round(totalSavings),
        projected: Math.round(totalSavings * 1.1),
      })
    }
    return data
  }, [profile, isPro])
  
  const healthData = projections.map((p) => ({
    year: `Year ${p.year}`,
    healthScore: p.health.score,
    energyLevel: p.health.energyLevel,
    productivity: p.productivity.score,
  }))
  
  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading your future...</div>
        </CardContent>
      </Card>
    )
  }
  
  if (!profile) {
    return (
      <Card className="border-border/50">
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Complete onboarding to see your future</div>
        </CardContent>
      </Card>
    )
  }
  
  // Available years based on plan
  const availableYears = isPro ? [1, 5, 10] : [1]
  const lockedYears = isPro ? [] : [5, 10]
  
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Future Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              See how your current choices shape your future
            </p>
          </div>
        </div>
        
        {/* Year selector */}
        <div className="flex gap-2 mt-4">
          {availableYears.map((year) => (
            <motion.button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedYear === year
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {year} {year === 1 ? 'Year' : 'Years'}
            </motion.button>
          ))}
          {lockedYears.map((year) => (
            <button
              key={year}
              disabled
              className="relative px-4 py-2 rounded-lg text-sm font-medium bg-muted/50 text-muted-foreground cursor-not-allowed flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              {year} Years
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="finances" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Finances
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Heart className="h-4 w-4" />
              Health
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {selectedProjection && (
                  <FutureSnapshot projection={selectedProjection} profile={profile} />
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="finances" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={detailedFinanceData}>
                      <defs>
                        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.72 0.15 175)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.72 0.15 175)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />
                      <XAxis 
                        dataKey="year" 
                        stroke="oklch(0.6 0 0)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="oklch(0.6 0 0)"
                        fontSize={12}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.16 0.015 260)',
                          border: '1px solid oklch(0.25 0.02 260)',
                          borderRadius: '8px',
                          color: 'oklch(0.95 0 0)',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Savings']}
                      />
                      <Area
                        type="monotone"
                        dataKey="savings"
                        stroke="oklch(0.72 0.15 175)"
                        strokeWidth={2}
                        fill="url(#savingsGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {selectedProjection && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(selectedProjection.finances.totalSavings)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Net Worth</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(selectedProjection.finances.netWorth)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Passive Income</p>
                      <p className="text-2xl font-bold text-chart-3">
                        {formatCurrency(selectedProjection.finances.monthlyPassiveIncome)}/mo
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="health" className="mt-0">
              {isPro ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={healthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />
                        <XAxis 
                          dataKey="year" 
                          stroke="oklch(0.6 0 0)"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="oklch(0.6 0 0)"
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(0.16 0.015 260)',
                            border: '1px solid oklch(0.25 0.02 260)',
                            borderRadius: '8px',
                            color: 'oklch(0.95 0 0)',
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="healthScore" 
                          name="Health Score"
                          fill="oklch(0.6 0.2 340)" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="energyLevel" 
                          name="Energy Level"
                          fill="oklch(0.75 0.16 85)" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="productivity" 
                          name="Productivity"
                          fill="oklch(0.65 0.18 280)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {selectedProjection && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Health Score</p>
                        <p className="text-2xl font-bold text-chart-4">
                          {selectedProjection.health.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedProjection.health.fitnessLevel}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Energy Level</p>
                        <p className="text-2xl font-bold text-chart-3">
                          {selectedProjection.health.energyLevel}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Skills Acquired</p>
                        <p className="text-2xl font-bold text-chart-2">
                          {selectedProjection.productivity.skillsAcquired}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <FeatureLock feature="Health & Productivity Insights">
                  <div className="h-[300px] bg-muted/20 rounded-lg" />
                </FeatureLock>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function FutureSnapshot({ projection, profile }: { projection: Projection; profile: UserProfile }) {
  const futureAge = profile.currentAge + projection.year
  
  return (
    <div className="space-y-6">
      {/* Future You Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-chart-2/5 to-chart-3/10 border border-primary/20 p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{futureAge}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">You in {projection.year} {projection.year === 1 ? 'Year' : 'Years'}</h3>
              <p className="text-sm text-muted-foreground">Age {futureAge}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Wealth</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(projection.finances.totalSavings)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Health</p>
              <p className="text-xl font-bold text-chart-4">
                {projection.health.score}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Productivity</p>
              <p className="text-xl font-bold text-chart-3">
                {projection.productivity.score}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Happiness</p>
              <p className="text-xl font-bold text-chart-2">
                {projection.life.happinessIndex}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/5" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-chart-2/5" />
      </div>
      
      {/* Quick insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border/50 bg-card">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Financial Milestone
          </h4>
          <p className="text-sm text-muted-foreground">
            {projection.finances.monthlyPassiveIncome > 500
              ? `Your investments could generate ${formatCurrency(projection.finances.monthlyPassiveIncome)}/month in passive income.`
              : `Keep saving! You're building your financial foundation.`}
          </p>
        </div>
        
        <div className="p-4 rounded-lg border border-border/50 bg-card">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-chart-4" />
            Health Status
          </h4>
          <p className="text-sm text-muted-foreground">
            {projection.health.score >= 70
              ? `You're on track for excellent health. Keep up your ${profile.exerciseFrequency}x/week routine!`
              : `Consider increasing exercise frequency to boost your health score.`}
          </p>
        </div>
        
        <div className="p-4 rounded-lg border border-border/50 bg-card">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-chart-2" />
            Life Progress
          </h4>
          <p className="text-sm text-muted-foreground">
            {`By age ${futureAge}, you could have achieved ${projection.life.goalsAchieved} major life goals and acquired ${projection.productivity.skillsAcquired} new skills.`}
          </p>
        </div>
      </div>
    </div>
  )
}
