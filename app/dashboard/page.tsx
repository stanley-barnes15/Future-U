import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SubscriptionProvider, SubscriptionPlan } from '@/lib/subscription-context'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const plan: SubscriptionPlan = subscription?.status === 'active' ? 'pro' : 'free'

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <SubscriptionProvider plan={plan}>
      <DashboardContent 
        user={user} 
        profile={profile}
        subscription={subscription}
      />
    </SubscriptionProvider>
  )
}
