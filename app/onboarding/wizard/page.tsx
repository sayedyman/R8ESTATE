"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { TrustCardPreview } from "@/components/onboarding/trust-card-preview"
import { WizardStep1, WizardStep2, WizardStep3, WizardStep4, WizardStep5, WizardStep6, WizardStep7 } from "@/components/onboarding/wizard-steps"

export default function WizardPage() {
  const router = useRouter()
  const { currentStep, selectedGoal, isOnboardingCompleted, userMode } = useOnboardingStore()

  React.useEffect(() => {
    if (isOnboardingCompleted) {
      if (userMode === "preview") {
        router.replace(ROUTES.PROFILE + "?preview=true")
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } else if (!selectedGoal) {
      router.replace(ROUTES.ONBOARDING_GOAL)
    }
  }, [selectedGoal, isOnboardingCompleted, router])

  if (isOnboardingCompleted || !selectedGoal) return null

  const steps = {
    WizardStep1,
    WizardStep2,
    WizardStep3,
    WizardStep4,
    WizardStep5,
    WizardStep6,
    WizardStep7,
  }

  const CurrentStepComponent = steps[`WizardStep${currentStep}` as keyof typeof steps]
  const progressPercentage = Math.min((currentStep / 6) * 100, 100)

  if (!CurrentStepComponent) {
    return null
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center h-full">
      
      {/* Left side: Live Preview (Sticky on desktop) */}
      <div className="w-full lg:w-1/2 flex justify-center lg:sticky lg:top-32 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-4 text-center lg:text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Live Preview</h2>
            <p className="text-xs text-slate-400">Updates as you type</p>
          </div>
          <TrustCardPreview />
        </div>
      </div>

      {/* Right side: Wizard Form */}
      <div className="w-full lg:w-1/2 flex flex-col order-1 lg:order-2">
      {currentStep < 7 && (
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {currentStep === 1 && "What do you want to be known for?"}
              {currentStep === 2 && "What's your biggest strength?"}
              {currentStep === 3 && "Profile Photo"}
              {currentStep === 4 && "Profile Information"}
              {currentStep === 5 && "Professional Experience"}
              {currentStep === 6 && "Professional Achievement"}
            </h1>
            <span className="text-sm font-medium text-slate-500 mb-1">
              Step {currentStep} of 6
            </span>
          </div>
          
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && <WizardStep1 />}
              {currentStep === 2 && <WizardStep2 />}
              {currentStep === 3 && <WizardStep3 />}
              {currentStep === 4 && <WizardStep4 />}
              {currentStep === 5 && <WizardStep5 />}
              {currentStep === 6 && <WizardStep6 />}
              {currentStep === 7 && <WizardStep7 />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  )
}
