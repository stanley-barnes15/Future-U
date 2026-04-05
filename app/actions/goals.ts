'use server'

import { z } from 'zod'

const goalSchema = z.object({
  category: z.enum(['personal', 'professional', 'academic']),
  title: z.string().min(5).max(160),
  timeframe: z.string().min(2).max(80),
})

const requestSchema = z.object({
  goals: z.array(goalSchema).min(1).max(5),
})

export type GoalInput = z.infer<typeof goalSchema>

export interface GoalPlan {
  goal: GoalInput
  milestones: string[]
  habits: string[]
}

function buildFallbackPlan(goal: GoalInput): GoalPlan {
  return {
    goal,
    milestones: [
      `Define a concrete success metric for "${goal.title}" within 48 hours.`,
      `Create a 30-day sprint plan toward ${goal.timeframe}.`,
      `Review progress weekly and adjust the next sprint.`,
    ],
    habits: [
      'Block 30 focused minutes per day for this goal.',
      'Track one measurable KPI daily in a notes app or spreadsheet.',
      'Run a weekly reflection: wins, blockers, next 3 actions.',
    ],
  }
}

export async function generateGoalPlan(input: { goals: GoalInput[] }): Promise<{ plans: GoalPlan[]; usedAI: boolean; error?: string }> {
  const parsed = requestSchema.safeParse(input)
  if (!parsed.success) {
    return { plans: [], usedAI: false, error: 'Invalid goal input.' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      plans: parsed.data.goals.map(buildFallbackPlan),
      usedAI: false,
    }
  }

  try {
    const prompt = `You are a goal coach. For each goal, generate:
- 3 short milestones
- 3 practical recurring habits
Return strict JSON with shape: {"plans":[{"goal":{"category":"","title":"","timeframe":""},"milestones":["","",""],"habits":["","",""]}]}
Goals: ${JSON.stringify(parsed.data.goals)}`

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`)
    }

    const data = await response.json()
    const outputText = data.output_text as string | undefined
    if (!outputText) {
      throw new Error('No output text returned from AI model')
    }

    const parsedOutput = JSON.parse(outputText) as { plans?: GoalPlan[] }
    if (!parsedOutput.plans || !Array.isArray(parsedOutput.plans)) {
      throw new Error('AI output missing plans array')
    }

    return {
      plans: parsedOutput.plans.map((plan) => ({
        goal: goalSchema.parse(plan.goal),
        milestones: (plan.milestones || []).slice(0, 3),
        habits: (plan.habits || []).slice(0, 3),
      })),
      usedAI: true,
    }
  } catch {
    return {
      plans: parsed.data.goals.map(buildFallbackPlan),
      usedAI: false,
      error: 'AI generation failed. Showing a high-quality fallback plan.',
    }
  }
}
