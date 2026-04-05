import { Crown, Zap } from 'lucide-react'

export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: 'month' | 'year' | 'one_time'
  features: string[]
  icon: React.ElementType
  popular?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic future projections',
    priceInCents: 0,
    interval: 'month',
    features: [
      '1-year projections',
      'Basic financial forecasting',
      'Limited scenario comparisons (2)',
      'Weekly nudges',
    ],
    icon: Zap,
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    description: 'Unlock the full power of Future U',
    priceInCents: 999, // $9.99/month
    interval: 'month',
    features: [
      '1, 5, and 10-year projections',
      'Advanced financial modeling',
      'Unlimited scenario comparisons',
      'Daily personalized nudges',
      'Goal tracking and milestones',
      'Priority support',
      'Export reports (coming soon)',
    ],
    icon: Crown,
    popular: true,
  },
]

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === productId)
}

export function isPaidProduct(productId: string): boolean {
  const product = getProduct(productId)
  return !!product && product.priceInCents > 0
}
