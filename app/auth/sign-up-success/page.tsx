import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Future You</span>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[oklch(0.65_0.18_145)] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>

          <CardTitle className="text-xl text-foreground">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We&apos;ve sent you a verification link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to verify your account and start exploring your future self.
          </p>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary font-medium mb-1">Testing in development?</p>
            <p className="text-xs text-muted-foreground">
              Verification should work locally too. In Supabase Auth settings, set Site URL to your local URL and add{' '}
              <span className="font-mono">http://localhost:3000/auth/callback</span> to redirect URLs.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive an email? Check your spam folder or{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                try again
              </Link>
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-block text-sm text-primary hover:underline"
          >
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
