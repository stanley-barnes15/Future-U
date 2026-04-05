'use client'

import { useAppStore } from '@/lib/store'
import { OnboardingWizard } from './onboarding/onboarding-wizard'
import { Dashboard } from './dashboard/dashboard'

export function AppWrapper() {
  const { hasCompletedOnboarding } = useAppStore()
  
  if (!hasCompletedOnboarding) {
    return <OnboardingWizard />
  }
  
  return <Dashboard />
}
