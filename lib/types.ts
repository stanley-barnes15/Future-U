export interface UserProfile {
  id: string
  name: string
  currentAge: number
  monthlyIncome: number
  monthlySavings: number
  currentSavings: number
  savingsGoal: number
  exerciseFrequency: number // times per week
  sleepHours: number
  goals: Goal[]
  habits: Habit[]
  createdAt: Date
}

export interface UserHabitsRow {
  user_id: string
  current_age: number | null
  monthly_income: number | null
  monthly_savings: number | null
  current_savings: number | null
  savings_goal: number | null
  exercise_frequency: number | null
  sleep_hours: number | null
}

export interface UserGoalRow {
  id: string
  user_id: string
  category: 'personal' | 'professional' | 'academic'
  title: string
  timeframe: string
  ai_plan: {
    milestones?: string[]
    habits?: string[]
  } | null
}

export interface Goal {
  id: string
  type: 'finance' | 'health' | 'productivity' | 'life'
  title: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
}

export interface Habit {
  id: string
  type: 'finance' | 'health' | 'productivity' | 'life'
  name: string
  frequency: number // per week
  intensity: 'low' | 'medium' | 'high'
  impactScore: number // -10 to 10
}

export interface Projection {
  year: number
  finances: {
    totalSavings: number
    netWorth: number
    monthlyPassiveIncome: number
  }
  health: {
    score: number // 0-100
    fitnessLevel: string
    energyLevel: number
  }
  productivity: {
    score: number
    skillsAcquired: number
    projectsCompleted: number
  }
  life: {
    goalsAchieved: number
    totalGoals: number
    happinessIndex: number
  }
}

export interface Scenario {
  id: string
  name: string
  description: string
  parameters: Record<string, number>
  projections: Projection[]
}

export type OnboardingStep = 'welcome' | 'basics' | 'finances' | 'health' | 'goals' | 'complete'
