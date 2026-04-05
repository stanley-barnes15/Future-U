import type { UserHabitsRow, UserProfile } from './types'

export function habitsToUserProfile(userId: string, habits: UserHabitsRow): UserProfile {
  return {
    id: userId,
    name: '',
    currentAge: habits.current_age ?? 25,
    monthlyIncome: habits.monthly_income ?? 3000,
    monthlySavings: habits.monthly_savings ?? 500,
    currentSavings: habits.current_savings ?? 0,
    savingsGoal: habits.savings_goal ?? 100000,
    exerciseFrequency: habits.exercise_frequency ?? 3,
    sleepHours: habits.sleep_hours ?? 7,
    goals: [],
    habits: [],
    createdAt: new Date(),
  }
}
