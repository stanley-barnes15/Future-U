'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, OnboardingStep } from './types'

interface AppState {
  profile: UserProfile | null
  onboardingStep: OnboardingStep
  hasCompletedOnboarding: boolean
  
  // Actions
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setOnboardingStep: (step: OnboardingStep) => void
  completeOnboarding: () => void
  resetApp: () => void
}

const defaultProfile: UserProfile = {
  id: '',
  name: '',
  currentAge: 25,
  monthlyIncome: 3000,
  monthlySavings: 500,
  savingsGoal: 100000,
  exerciseFrequency: 3,
  sleepHours: 7,
  goals: [],
  habits: [],
  createdAt: new Date(),
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      onboardingStep: 'welcome',
      hasCompletedOnboarding: false,
      
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : { ...defaultProfile, ...updates },
        })),
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true, onboardingStep: 'complete' }),
      
      resetApp: () =>
        set({
          profile: null,
          onboardingStep: 'welcome',
          hasCompletedOnboarding: false,
        }),
    }),
    {
      name: 'future-you-storage',
    }
  )
)
