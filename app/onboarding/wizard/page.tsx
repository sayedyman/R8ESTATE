"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { useAuthStore } from "@/stores/auth-store"
import { ROUTES } from "@/constants/routes"
import { TrustCardPreview } from "@/components/onboarding/trust-card-preview"
import { WizardStep1, WizardStep2, WizardStep3, WizardStep4, WizardStep5, WizardStep6, WizardStep7 } from "@/components/onboarding/wizard-steps"
import { useTranslations } from "@/hooks/use-translations"
import { Button } from "@/components/ui/button"

export default function WizardPage() {
  const router = useRouter()
  const { currentStep, selectedGoal, isOnboardingCompleted, userMode, trustCardDraft, updateDraft, skipStep } = useOnboardingStore()
  const { user } = useAuthStore()
  const t = useTranslations("onboarding.wizard")

  React.useEffect(() => {
    if (user) {
      const updates: Partial<typeof trustCardDraft> = {}
      if (!trustCardDraft.fullName && user.name) {
        updates.fullName = user.name
      }
      if (!trustCardDraft.profilePhoto && user.profilePhoto) {
        updates.profilePhoto = user.profilePhoto
      }
      if (Object.keys(updates).length > 0) {
        updateDraft(updates)
      }
    }
  }, [user, trustCardDraft, updateDraft])

  React.useEffect(() => {
    if (currentStep === 8) return;

    if (isOnboardingCompleted) {
      if (userMode === "preview") {
        router.replace(ROUTES.PROFILE + "?preview=true")
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } else if (!selectedGoal) {
      router.replace(ROUTES.ONBOARDING_GOAL)
    }
  }, [selectedGoal, isOnboardingCompleted, router, currentStep, userMode])

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
    <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 items-start lg:items-center justify-center h-full py-4 lg:py-8">
      
      {/* Left side: Live Preview */}
      <div className="w-full lg:flex-1 lg:flex lg:flex-col lg:justify-center order-2 lg:order-1 lg:h-full lg:max-h-[85vh]">
        <div className="w-full lg:scale-[0.95] xl:scale-[0.95] origin-center">
          <div className="mb-3 lg:mb-4 text-center lg:text-start">
            <h2 className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{t("livePreviewTitle")}</h2>
            <p className="text-[10px] lg:text-xs text-slate-400">{t("updatesAsYouType")}</p>
          </div>
          <TrustCardPreview />
        </div>
      </div>

      {/* Right side: Wizard Form */}
      <div className="w-full lg:w-[440px] shrink-0 flex flex-col order-1 lg:order-2 lg:justify-center lg:h-full lg:max-h-[85vh]">
      {currentStep < 7 && (
        <div className="mb-3 lg:mb-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentStep === 1 && t("step1Title")}
                {currentStep === 2 && t("step2Title")}
                {currentStep === 3 && t("step3Title")}
                {currentStep === 4 && t("cvImportTitle", { defaultValue: "Import from CV" })}
                {currentStep === 5 && t("step5Title")}
                {currentStep === 6 && t("step6Title")}
              </h1>
              <span className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
                {t("stepXof6", { step: currentStep, defaultValue: `Step ${currentStep} of 6` })}
              </span>
            </div>
            {currentStep <= 6 && currentStep !== 3 && (
              <Button variant="outline" size="sm" onClick={skipStep} className="text-slate-600 font-semibold hover:bg-slate-100 border-slate-200">
                Skip
              </Button>
            )}
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

        <div className="bg-white p-5 sm:p-6 lg:p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 lg:max-h-full lg:overflow-y-auto">
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
