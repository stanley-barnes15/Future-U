import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Future You</span>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          
          <CardTitle className="text-xl text-foreground">Authentication Error</CardTitle>
          <CardDescription className="text-muted-foreground">
            Something went wrong during authentication
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The verification link may have expired or is invalid. Please try signing up again or contact support if the problem persists.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/sign-up">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="border-border text-foreground hover:bg-secondary">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
