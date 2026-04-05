'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart, Target, Sparkles, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, generateProjections } from '@/lib/projection-engine'
import type { UserProfile, Projection } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface StatsOverviewProps {
  isPro: boolean
}

export function StatsOverview({ isPro }: StatsOverviewProps) {
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
        setProjections(generateProjections(userProfile, [1, 5, 10]))
      }
      
      setLoading(false)
    }
    
    loadData()
  }, [])
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-muted mb-3" />
                <div className="h-8 bg-muted rounded w-20 mb-2" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  if (!profile) return null
  
  // Use 1-year projection for free users, 10-year for pro
  const displayProjection = isPro 
    ? projections.find((p) => p.year === 10) 
    : projections.find((p) => p.year === 1)
  
  if (!displayProjection) return null
  
  const stats = [
    {
      label: 'Projected Savings',
      value: formatCurrency(displayProjection.finances.totalSavings),
      sublabel: isPro ? 'in 10 years' : 'in 1 year',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      locked: false,
    },
    {
      label: 'Health Score',
      value: isPro ? `${displayProjection.health.score}%` : '??',
      sublabel: isPro ? displayProjection.health.fitnessLevel : 'Upgrade to unlock',
      icon: <Heart className="h-5 w-5" />,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      locked: !isPro,
    },
    {
      label: 'Productivity',
      value: isPro ? `${displayProjection.productivity.score}%` : '??',
      sublabel: isPro ? `${displayProjection.productivity.skillsAcquired} skills` : 'Upgrade to unlock',
      icon: <Target className="h-5 w-5" />,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      locked: !isPro,
    },
    {
      label: 'Life Goals',
      value: isPro ? `${displayProjection.life.goalsAchieved}/${displayProjection.life.totalGoals}` : '??',
      sublabel: isPro ? `${displayProjection.life.happinessIndex}% happiness` : 'Upgrade to unlock',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      locked: !isPro,
    },
  ]
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`border-border/50 hover:border-border transition-colors ${stat.locked ? 'opacity-70' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                  {stat.locked ? <Lock className="h-5 w-5" /> : stat.icon}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{stat.sublabel}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
