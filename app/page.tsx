import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
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
            <span className="text-xl font-bold text-foreground">Future U</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            {user ? (
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </>
            )}
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
          Meet Your <span className="text-primary">Future Self</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
          Visualize how your current habits in finances, health, and productivity
          shape who you become in 1, 5, and 10 years. Start your journey in 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8">
            <Link href={user ? '/dashboard' : '/auth/sign-up'}>
              {user ? 'Open Dashboard' : 'Start Free'}
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
          {[
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: 'Financial Forecast',
              description: 'See your net worth and passive income grow over time',
              color: 'text-primary'
            },
            {
              icon: <Heart className="w-6 h-6" />,
              title: 'Health Trajectory',
              description: 'Track fitness, energy, and wellness projections',
              color: 'text-chart-4'
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: 'Goal Achievement',
              description: 'Visualize milestones and success probability',
              color: 'text-chart-3'
            },
            {
              icon: <Clock className="w-6 h-6" />,
              title: 'Daily Nudges',
              description: 'Get personalized actions to improve your future',
              color: 'text-chart-2'
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className={`mb-4 ${feature.color}`}>{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        <Card className="bg-gradient-to-br from-primary/10 via-background to-chart-2/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Meet Your Future Self?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of people already transforming their lives with data-driven insights.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-sm">
              {[
                'No credit card required',
                '60-second setup',
                'Instant projections'
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8">
              <Link href={user ? '/dashboard' : '/auth/sign-up'}>
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Future U</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Future U. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
