import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Heart, 
  Target, 
  Clock,
  Check,
  ChevronRight
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-chart-2/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-chart-3/5 rounded-full blur-3xl" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Future You</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/pricing" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          See your tomorrow, today
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-6 text-balance">
          Meet Your{' '}
          <span className="text-primary">Future Self</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
          Visualize how your current habits in finances, health, and productivity 
          shape who you become in 1, 5, and 10 years. Start your journey in 60 seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8">
            <Link href="/auth/sign-up">
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/pricing">
              View Pricing
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary">60s</div>
            <div className="text-sm text-muted-foreground">to get started</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">10yr</div>
            <div className="text-sm text-muted-foreground">projections</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">Free</div>
            <div className="text-sm text-muted-foreground">to begin</div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Shape Your Future
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our projection engine analyzes your current habits and shows you exactly 
            where you&apos;re headed—and how small changes create massive differences.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Financial Projections</h3>
              <p className="text-sm text-muted-foreground">
                See your wealth grow with compound interest calculations and passive income forecasts.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-chart-4" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Health Forecasts</h3>
              <p className="text-sm text-muted-foreground">
                Track how exercise and sleep habits impact your energy, fitness, and longevity.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Scenario Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare &quot;what if&quot; scenarios to see how different choices affect your future.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-chart-2" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Daily Nudges</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized reminders that connect today&apos;s actions to your future goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Pricing Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground">
            Start free, upgrade when you&apos;re ready for more
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
              <div className="text-4xl font-bold text-foreground mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                {[
                  '1-year projections',
                  'Basic financial forecast',
                  '2 scenario comparisons',
                  'Weekly nudges',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Pro Plan */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '1, 5, and 10-year projections',
                  'Advanced financial modeling',
                  'Unlimited scenarios',
                  'Daily personalized nudges',
                  'Health & productivity insights',
                  'Export reports',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <Card className="bg-gradient-to-br from-primary/10 via-chart-2/5 to-chart-3/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Meet Your Future Self?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of people who are making better decisions today 
              by seeing exactly where they lead tomorrow.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Link href="/auth/sign-up">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Future You</span>
          </div>
          <p className="text-sm text-muted-foreground">
            See your tomorrow, today.
          </p>
        </div>
      </footer>
    </div>
  )
}
