"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Target, Users, TrendingUp, Award } from "lucide-react"
import { useOnboardingStore, type Goal } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { WizardNavigation } from "@/components/onboarding/wizard-navigation"

const GOALS = [
  { id: "More Leads", icon: Target, label: "More Leads", description: "Attract and convert more potential clients." },
  { id: "More Referrals", icon: Users, label: "More Referrals", description: "Build a network that works for you." },
  { id: "More Deals", icon: TrendingUp, label: "More Deals", description: "Close transactions faster and smoother." },
  { id: "More Authority", icon: Award, label: "More Authority", description: "Establish yourself as a market leader." },
] as const

export default function GoalSelectionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <GoalSelectionContent />
    </React.Suspense>
  )
}

function GoalSelectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNew = searchParams.get("new") === "true"
  const { selectedGoal, setGoal, isOnboardingCompleted, userMode, resetPreviewDraft, reset } = useOnboardingStore()

  // Reset the onboarding flow if starting fresh
  React.useEffect(() => {
    if (isNew) {
      reset()
    }
  }, [isNew, reset])

  React.useEffect(() => {
    // Only redirect if not starting fresh and they are already completed and registered
    if (!isNew && isOnboardingCompleted && userMode === "registered") {
      router.replace(ROUTES.DASHBOARD)
    }
  }, [isNew, isOnboardingCompleted, userMode, router])

  const handleContinue = () => {
    if (selectedGoal) {
      router.push(ROUTES.ONBOARDING_WIZARD)
    }
  }

  const handleGoalSelect = (goalId: Goal) => {
    if (isNew || (isOnboardingCompleted && userMode === "preview")) {
      resetPreviewDraft()
    }
    setGoal(goalId)
  }

  // Avoid hydration mismatch or flashing if redirecting registered users
  if (!isNew && isOnboardingCompleted && userMode === "registered") return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto flex flex-col items-center"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          What is your primary goal?
        </h1>
        <p className="text-slate-500 text-lg">
          Select what you want to achieve with your Trust Card.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
        {GOALS.map((goal) => {
          const Icon = goal.icon
          const isSelected = selectedGoal === goal.id

          return (
            <button
              key={goal.id}
              onClick={() => handleGoalSelect(goal.id as Goal)}
              className={`relative flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-200 text-left overflow-hidden ${
                isSelected 
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              )}
              <div className={`p-3 rounded-xl mb-4 ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg mb-1 ${isSelected ? "text-primary" : "text-slate-900"}`}>
                {goal.label}
              </h3>
              <p className={`text-sm ${isSelected ? "text-slate-700" : "text-slate-500"}`}>
                {goal.description}
              </p>
            </button>
          )
        })}
      </div>

      <div className="w-full">
        <WizardNavigation 
          onNext={handleContinue} 
          nextLabel="Continue" 
          nextDisabled={!selectedGoal} 
          isSubmit={false}
        />
      </div>
    </motion.div>
  )
}
