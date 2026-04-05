"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wallet,
  Heart,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { createClient } from "@/lib/supabase/client";

type OnboardingStep = "welcome" | "basics" | "finances" | "health" | "goals";

const [submitError, setSubmitError] = useState<string | null>(null);

const steps: { id: OnboardingStep; title: string; icon: React.ReactNode }[] = [
  { id: "welcome", title: "Welcome", icon: <Sparkles className="h-5 w-5" /> },
  { id: "basics", title: "About You", icon: <Target className="h-5 w-5" /> },
  { id: "finances", title: "Finances", icon: <Wallet className="h-5 w-5" /> },
  { id: "health", title: "Health", icon: <Heart className="h-5 w-5" /> },
  { id: "goals", title: "Goals", icon: <Target className="h-5 w-5" /> },
];

interface OnboardingWizardProps {
  userId: string;
  onComplete: () => void;
}

export function OnboardingWizard({
  userId,
  onComplete,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: 25,
    monthlyIncome: 3000,
    monthlySavings: 500,
    savingsGoal: 100000,
    exerciseFrequency: 3,
    sleepHours: 7,
  });

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = async () => {
    setSubmitError(null);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    } else {
      // Complete onboarding - save to database
      setLoading(true);

      const supabase = createClient();

      // Update profile
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: formData.name,
          onboarding_completed: true,
        },
        {
          onConflict: "id",
        }
      );

      // Save habits
      const { error: habitsError } = await supabase.from("user_habits").upsert(
        {
          user_id: userId,
          current_age: formData.age,
          monthly_income: formData.monthlyIncome,
          monthly_savings: formData.monthlySavings,
          savings_goal: formData.savingsGoal,
          exercise_frequency: formData.exerciseFrequency,
          sleep_hours: formData.sleepHours,
        },
        {
          onConflict: "user_id",
        }
      );

      if (habitsError) {
        setSubmitError("We could not save your habits yet. Please try again.");
        console.error("Error saving habits:", habitsError);
        setLoading(false);
        return;
      }

      setLoading(false);
      onComplete();
      router.refresh();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 ${
                index <= currentStepIndex
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : index < currentStepIndex
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            {currentStep === "welcome" && <WelcomeStep />}

            {currentStep === "basics" && (
              <BasicsStep formData={formData} setFormData={setFormData} />
            )}

            {currentStep === "finances" && (
              <FinancesStep formData={formData} setFormData={setFormData} />
            )}

            {currentStep === "health" && (
              <HealthStep formData={formData} setFormData={setFormData} />
            )}

            {currentStep === "goals" && <GoalsStep formData={formData} />}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStepIndex === 0 || loading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button onClick={handleNext} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {currentStepIndex === steps.length - 1
                      ? "See Your Future"
                      : "Continue"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Meet Your Future Self
        </h1>
        <p className="text-muted-foreground mt-2 text-balance leading-relaxed">
          See how your daily choices today shape who you become tomorrow.
          {"Let's"} visualize your potential in just 60 seconds.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        {[
          { icon: <Wallet className="h-5 w-5" />, label: "Finances" },
          { icon: <Heart className="h-5 w-5" />, label: "Health" },
          { icon: <Target className="h-5 w-5" />, label: "Goals" },
          { icon: <Sparkles className="h-5 w-5" />, label: "Life" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
          >
            <div className="text-primary">{item.icon}</div>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StepProps {
  formData: {
    name: string;
    age: number;
    monthlyIncome: number;
    monthlySavings: number;
    savingsGoal: number;
    exerciseFrequency: number;
    sleepHours: number;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      age: number;
      monthlyIncome: number;
      monthlySavings: number;
      savingsGoal: number;
      exerciseFrequency: number;
      sleepHours: number;
    }>
  >;
}

function BasicsStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">About You</h2>
        <p className="text-muted-foreground mt-1">
          {"Let's"} start with the basics
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{"What's"} your name?</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-3">
          <Label>How old are you?</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[formData.age]}
              onValueChange={([value]) =>
                setFormData({ ...formData, age: value })
              }
              min={18}
              max={70}
              step={1}
              className="flex-1"
            />
            <span className="w-16 text-right font-mono text-lg">
              {formData.age} yrs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancesStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Your Finances</h2>
        <p className="text-muted-foreground mt-1">
          {"Let's"} understand your money habits
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <Label>Monthly Income</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[formData.monthlyIncome]}
              onValueChange={([value]) =>
                setFormData({ ...formData, monthlyIncome: value })
              }
              min={1000}
              max={20000}
              step={100}
              className="flex-1"
            />
            <span className="w-20 text-right font-mono text-lg">
              ${formData.monthlyIncome.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Monthly Savings</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[formData.monthlySavings]}
              onValueChange={([value]) =>
                setFormData({ ...formData, monthlySavings: value })
              }
              min={0}
              max={formData.monthlyIncome}
              step={50}
              className="flex-1"
            />
            <span className="w-20 text-right font-mono text-lg">
              ${formData.monthlySavings.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(
              (formData.monthlySavings / formData.monthlyIncome) * 100
            )}
            % savings rate
          </p>
        </div>

        <div className="space-y-3">
          <Label>Savings Goal</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[formData.savingsGoal]}
              onValueChange={([value]) =>
                setFormData({ ...formData, savingsGoal: value })
              }
              min={10000}
              max={1000000}
              step={10000}
              className="flex-1"
            />
            <span className="w-24 text-right font-mono text-lg">
              ${formData.savingsGoal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Your Health</h2>
        <p className="text-muted-foreground mt-1">
          Physical habits shape your future
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <Label>Exercise per week</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[formData.exerciseFrequency]}
              onValueChange={([value]) =>
                setFormData({ ...formData, exerciseFrequency: value })
              }
              min={0}
              max={7}
              step={1}
              className="flex-1"
            />
            <span className="w-20 text-right font-mono text-lg">
              {formData.exerciseFrequency}x/week
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Sedentary</span>
            <span>Athletic</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Average sleep hours</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[formData.sleepHours]}
              onValueChange={([value]) =>
                setFormData({ ...formData, sleepHours: value })
              }
              min={4}
              max={10}
              step={0.5}
              className="flex-1"
            />
            <span className="w-20 text-right font-mono text-lg">
              {formData.sleepHours}hrs
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Too little</span>
            <span>Optimal (7-9)</span>
            <span>Too much</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsStep({ formData }: { formData: StepProps["formData"] }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Ready to See Your Future?</h2>
        <p className="text-muted-foreground mt-1">
          {"Here's"} a preview of what {"we'll"} calculate
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <h3 className="font-semibold text-primary mb-2">
            Financial Projection
          </h3>
          <p className="text-sm text-muted-foreground">
            At ${formData.monthlySavings.toLocaleString()}/month with 7%
            returns, {"we'll"} show your wealth trajectory over 1, 5, and 10
            years.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
          <h3 className="font-semibold text-chart-2 mb-2">Health Forecast</h3>
          <p className="text-sm text-muted-foreground">
            Based on {formData.exerciseFrequency}x exercise/week and{" "}
            {formData.sleepHours}hrs sleep, {"we'll"} project your health score.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
          <h3 className="font-semibold text-chart-3 mb-2">Life Goals</h3>
          <p className="text-sm text-muted-foreground">
            {"We'll"} help you visualize and track progress toward your biggest
            life goals.
          </p>
        </div>
      </div>
    </div>
  );
}
