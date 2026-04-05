'use client'

import { motion } from 'framer-motion'
import { Sparkles, X, Wallet, Heart, Target, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { UserHabitsRow } from '@/lib/types'

interface Nudge {
  message: string
  impact: string
  category: 'finance' | 'health' | 'productivity' | 'life'
}

const categoryIcons = {
  finance: <Wallet className="h-5 w-5" />,
  health: <Heart className="h-5 w-5" />,
  productivity: <Lightbulb className="h-5 w-5" />,
  life: <Target className="h-5 w-5" />,
}

const categoryColors = {
  finance: 'from-primary/20 to-primary/5 border-primary/30',
  health: 'from-chart-4/20 to-chart-4/5 border-chart-4/30',
  productivity: 'from-chart-3/20 to-chart-3/5 border-chart-3/30',
  life: 'from-chart-2/20 to-chart-2/5 border-chart-2/30',
}

const nudgeTemplates: Nudge[] = [
  {
    message: 'Save an extra $50 today',
    impact: 'Future you will have $847 more in 10 years thanks to compound growth',
    category: 'finance',
  },
  {
    message: 'Take a 30-minute walk',
    impact: 'Just 30 minutes of walking daily can increase your energy by 20% and add years to your life',
    category: 'health',
  },
  {
    message: 'Learn something new for 15 minutes',
    impact: 'Daily learning compounds to mastering new skills every few months',
    category: 'productivity',
  },
  {
    message: 'Call a friend or family member',
    impact: 'Strong relationships are the #1 predictor of long-term happiness and longevity',
    category: 'life',
  },
  {
    message: 'Skip one unnecessary purchase today',
    impact: 'Small savings add up: $10/day becomes $3,650/year or $50,000+ in 10 years with growth',
    category: 'finance',
  },
  {
    message: 'Get to bed 30 minutes earlier tonight',
    impact: 'Better sleep improves decision-making, productivity, and overall health score by 15%',
    category: 'health',
  },
  {
    message: 'Review your goals for 5 minutes',
    impact: 'People who regularly review goals are 42% more likely to achieve them',
    category: 'productivity',
  },
  {
    message: 'Express gratitude to someone',
    impact: 'Gratitude practices are linked to 25% higher life satisfaction scores',
    category: 'life',
  },
]

interface DailyNudgeProps {
  initialHabits: UserHabitsRow | null
}

export function DailyNudge({ initialHabits }: DailyNudgeProps) {
  const [dismissed, setDismissed] = useState(false)
  const monthlySavings = initialHabits?.monthly_savings ?? 0

  // Pick a consistent nudge based on the current date
  const nudge = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const index = dayOfYear % nudgeTemplates.length
    const baseNudge = nudgeTemplates[index]

    // Personalize finance nudges
    if (baseNudge.category === 'finance' && monthlySavings > 0) {
      const extraSavings = Math.round(monthlySavings * 0.1) // Suggest 10% more
      const futureValue = Math.round(extraSavings * 12 * Math.pow(1.07, 10))
      return {
        ...baseNudge,
        message: `Save an extra $${extraSavings} this month`,
        impact: `Future you will have $${futureValue.toLocaleString()} more in 10 years thanks to compound growth`,
      }
    }

    return baseNudge
  }, [monthlySavings])

  if (dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-xl border bg-gradient-to-r ${categoryColors[nudge.category]} p-4 overflow-hidden`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {categoryIcons[nudge.category]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              Today&apos;s Nudge
            </span>
          </div>
          <p className="font-semibold text-foreground">{nudge.message}</p>
          <p className="text-sm text-muted-foreground mt-1">{nudge.impact}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Decorative element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary/5" />
    </motion.div>
  )
}
