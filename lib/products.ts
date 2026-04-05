export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: 'month' | 'year' | 'one_time'
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic future projections',
    priceInCents: 0,
    interval: 'month',
    features: [
      '1-year projections only',
      'Basic financial forecast',
      'Limited scenario comparisons (2)',
      'Weekly nudges',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    description: 'Unlock the full power of Future You',
    priceInCents: 999, // $9.99/month
    interval: 'month',
    features: [
      '1, 5, and 10-year projections',
      'Advanced financial modeling',
      'Unlimited scenario comparisons',
      'Daily personalized nudges',
      'Health & productivity insights',
      'Export reports',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    description: 'Best value - save 2 months!',
    priceInCents: 9999, // $99.99/year
    interval: 'year',
    features: [
      'Everything in Pro Monthly',
      '2 months free',
      'Priority support',
      'Early access to new features',
    ],
  },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function isPaidProduct(id: string): boolean {
  return id !== 'free'
}
