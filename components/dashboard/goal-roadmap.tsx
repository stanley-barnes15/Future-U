'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { UserGoalRow } from '@/lib/types'
import { Target } from 'lucide-react'

interface GoalRoadmapProps {
  goals: UserGoalRow[]
}

export function GoalRoadmap({ goals }: GoalRoadmapProps) {
  if (!goals.length) return null

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-primary" />
          Goal Roadmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your long-term goals, with AI-generated milestones and habits.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="font-semibold">{goal.title}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{goal.category}</Badge>
                <Badge variant="outline">{goal.timeframe}</Badge>
              </div>
            </div>

            {goal.ai_plan?.milestones?.length ? (
              <div>
                <p className="text-sm font-medium">Milestones</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {goal.ai_plan.milestones.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {goal.ai_plan?.habits?.length ? (
              <div>
                <p className="text-sm font-medium">Habits</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {goal.ai_plan.habits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
