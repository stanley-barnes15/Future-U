import type { UserProfile, Projection } from './types'

const INTEREST_RATE = 0.07 // 7% annual return
const INFLATION_RATE = 0.03 // 3% inflation

export function calculateProjections(profile: UserProfile, years: number[]): Projection[] {
  return years.map((year) => ({
    year,
    finances: calculateFinanceProjection(profile, year),
    health: calculateHealthProjection(profile, year),
    productivity: calculateProductivityProjection(profile, year),
    life: calculateLifeProjection(profile, year),
  }))
}

function calculateFinanceProjection(profile: UserProfile, yearsFromNow: number) {
  const monthlyContribution = profile.monthlySavings
  const annualContribution = monthlyContribution * 12
  
  // Compound interest formula with regular contributions
  // FV = P * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
  const principal = 0 // Starting from 0 for simplicity
  const rate = INTEREST_RATE
  const n = yearsFromNow
  
  const compoundGrowth = principal * Math.pow(1 + rate, n)
  const contributionGrowth = annualContribution * ((Math.pow(1 + rate, n) - 1) / rate)
  
  const totalSavings = compoundGrowth + contributionGrowth
  const netWorth = totalSavings * 1.2 // Assuming other assets
  const monthlyPassiveIncome = (totalSavings * 0.04) / 12 // 4% withdrawal rate
  
  return {
    totalSavings: Math.round(totalSavings),
    netWorth: Math.round(netWorth),
    monthlyPassiveIncome: Math.round(monthlyPassiveIncome),
  }
}

function calculateHealthProjection(profile: UserProfile, yearsFromNow: number) {
  const baseScore = 50
  
  // Exercise impact
  const exerciseBonus = Math.min(profile.exerciseFrequency * 5, 30)
  
  // Sleep impact
  const optimalSleep = 8
  const sleepDiff = Math.abs(profile.sleepHours - optimalSleep)
  const sleepBonus = Math.max(0, 20 - sleepDiff * 5)
  
  // Age decay (subtle)
  const ageDecay = yearsFromNow * 0.5
  
  // Calculate final score
  let score = baseScore + exerciseBonus + sleepBonus - ageDecay
  score = Math.max(0, Math.min(100, score))
  
  const fitnessLevels = ['Sedentary', 'Light', 'Moderate', 'Active', 'Athletic', 'Peak']
  const fitnessIndex = Math.min(Math.floor(score / 20), 5)
  
  return {
    score: Math.round(score),
    fitnessLevel: fitnessLevels[fitnessIndex],
    energyLevel: Math.round(score * 0.9),
  }
}

function calculateProductivityProjection(profile: UserProfile, yearsFromNow: number) {
  // Calculate productivity based on habits
  const productivityHabits = profile.habits.filter(h => h.type === 'productivity')
  const habitBonus = productivityHabits.reduce((acc, h) => acc + h.impactScore * h.frequency, 0)
  
  const baseScore = 50 + habitBonus
  const growthOverTime = yearsFromNow * 3 // Skills compound
  
  const score = Math.min(100, baseScore + growthOverTime)
  
  return {
    score: Math.round(score),
    skillsAcquired: Math.floor(yearsFromNow * 2),
    projectsCompleted: Math.floor(yearsFromNow * 4),
  }
}

function calculateLifeProjection(profile: UserProfile, yearsFromNow: number) {
  const totalGoals = profile.goals.length || 5
  
  // Calculate goals achieved based on progress rate
  const progressRate = 0.15 // 15% of goals achieved per year on average
  const goalsAchieved = Math.min(
    totalGoals,
    Math.floor(totalGoals * progressRate * yearsFromNow)
  )
  
  // Happiness based on goal progress and health
  const goalProgress = goalsAchieved / totalGoals
  const baseHappiness = 60
  const happinessBonus = goalProgress * 30
  
  return {
    goalsAchieved,
    totalGoals,
    happinessIndex: Math.round(baseHappiness + happinessBonus),
  }
}

export function compareScenarios(
  profile: UserProfile,
  adjustments: Record<string, number>,
  years: number[]
): { baseline: Projection[]; adjusted: Projection[] } {
  const baseline = calculateProjections(profile, years)
  
  const adjustedProfile = {
    ...profile,
    monthlySavings: profile.monthlySavings + (adjustments.savingsChange || 0),
    exerciseFrequency: profile.exerciseFrequency + (adjustments.exerciseChange || 0),
    sleepHours: profile.sleepHours + (adjustments.sleepChange || 0),
  }
  
  const adjusted = calculateProjections(adjustedProfile, years)
  
  return { baseline, adjusted }
}

export function generateDailyNudge(profile: UserProfile): {
  message: string
  impact: string
  category: 'finance' | 'health' | 'productivity' | 'life'
} {
  const nudges = [
    {
      message: `Save an extra £50 today`,
      impact: `Your future self will have £${Math.round(50 * Math.pow(1.07, 10))} more in 10 years`,
      category: 'finance' as const,
    },
    {
      message: `Get 30 minutes of exercise`,
      impact: `Boost your health score by 2 points this week`,
      category: 'health' as const,
    },
    {
      message: `Learn something new for 20 minutes`,
      impact: `Compound your knowledge - 365 hours of learning per year`,
      category: 'productivity' as const,
    },
    {
      message: `Reach out to someone you care about`,
      impact: `Strong relationships are the #1 predictor of happiness`,
      category: 'life' as const,
    },
  ]
  
  return nudges[Math.floor(Math.random() * nudges.length)]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}
