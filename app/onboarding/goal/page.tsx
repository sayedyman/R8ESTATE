"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Target, Users, TrendingUp, Award } from "lucide-react"
import { useOnboardingStore, type Goal } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrustCardPreview } from "@/components/onboarding/trust-card-preview"

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
  const isNew = searchParams.get('new') === 'true'
  const { trustCardDraft, selectedGoal, setGoal, isOnboardingCompleted, userMode, reset, updateDraft } = useOnboardingStore()

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

  const handleGoalSelect = (goalId: Goal) => {
    setGoal(goalId)
    // Automatically navigate to the next step
    router.push(ROUTES.ONBOARDING_WIZARD)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDraft({ fullName: e.target.value })
  }

  // Avoid hydration mismatch or flashing if redirecting registered users
  if (!isNew && isOnboardingCompleted && userMode === "registered") return null

  return (
    <div className="w-full flex flex-col items-center justify-start h-full pt-2 lg:pt-4 pb-8 px-4 sm:px-6">
      
      {/* Shared content container enforcing identical widths */}
      <div className="w-full max-w-4xl flex flex-col gap-4 lg:gap-6">
        
        {/* Top side: Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40"
        >
          <div className="text-center mb-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1">
              Let&apos;s build your Trust Card
            </h1>
            <p className="text-slate-500 text-sm">
              Start by entering your name and selecting your primary goal.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-semibold text-slate-900">
                What&apos;s your name?
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Jane Doe"
                value={trustCardDraft.fullName || ""}
                onChange={handleNameChange}
                className="h-10 text-sm px-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-900">
                What is your primary goal?
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                {GOALS.map((goal) => {
                  const Icon = goal.icon
                  const isSelected = selectedGoal === goal.id

                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal.id as Goal)}
                      className={`relative flex flex-col items-center p-2.5 rounded-xl border-2 transition-all duration-200 text-center overflow-hidden ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                      )}
                      <div className={`p-2 rounded-lg mb-1.5 ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className={`font-bold text-xs ${isSelected ? "text-primary" : "text-slate-900"}`}>
                        {goal.label}
                      </h3>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom side: Live Preview */}
        <div className="w-full flex flex-col items-center transform scale-95 sm:scale-100 origin-top px-4 sm:px-5">
          <div className="mb-2 text-center w-full">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Live Preview</h2>
          </div>
          <div className="w-full">
            <TrustCardPreview />
          </div>
        </div>
        
      </div>
    </div>
  )
}
