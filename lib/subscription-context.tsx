'use client'

import { createContext, useContext, ReactNode } from 'react'

export type SubscriptionPlan = 'free' | 'pro'

interface SubscriptionContextType {
  plan: SubscriptionPlan
  isPro: boolean
  canAccessFeature: (feature: FeatureKey) => boolean
}

export type FeatureKey = 
  | 'year-5-projection'
  | 'year-10-projection'
  | 'unlimited-scenarios'
  | 'daily-nudges'
  | 'health-insights'
  | 'export-reports'

const FEATURE_ACCESS: Record<FeatureKey, SubscriptionPlan[]> = {
  'year-5-projection': ['pro'],
  'year-10-projection': ['pro'],
  'unlimited-scenarios': ['pro'],
  'daily-nudges': ['pro'],
  'health-insights': ['pro'],
  'export-reports': ['pro'],
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ 
  children, 
  plan 
}: { 
  children: ReactNode
  plan: SubscriptionPlan 
}) {
  const isPro = plan === 'pro'

  const canAccessFeature = (feature: FeatureKey): boolean => {
    const allowedPlans = FEATURE_ACCESS[feature]
    if (!allowedPlans) return true
    return allowedPlans.includes(plan)
  }

  return (
    <SubscriptionContext.Provider value={{ plan, isPro, canAccessFeature }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
