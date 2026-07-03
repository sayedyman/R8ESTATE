"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { WizardNavigation } from "@/components/onboarding/wizard-navigation"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"

export function AchievementStep() {
  const router = useRouter()
  const { trustCardDraft, updateDraft, previousStep } = useOnboardingStore()
  const t = useTranslations("onboarding.wizard")

  const achievement = trustCardDraft.achievement || {
    title: "",
    description: ""
  }

  const handleChange = (field: string, value: string) => {
    updateDraft({
      achievement: {
        ...achievement,
        [field]: value
      }
    })
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(ROUTES.PUBLISH_TRUST_CARD)
  }

  const handleSkip = () => {
    updateDraft({ achievement: null })
    router.push(ROUTES.PUBLISH_TRUST_CARD)
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="flex justify-end -mt-2 mb-2">
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50/50 bg-transparent"
        >
          Skip for now
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2">
          <Label htmlFor="achTitle">{t("achievementTitle")}</Label>
          <Input 
            id="achTitle" 
            value={achievement.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Top Sales Agent 2024"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="achDescription">{t("shortDescription")}</Label>
          <Textarea 
            id="achDescription" 
            value={achievement.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="h-24 resize-none"
            placeholder="e.g. Closed $5M in property sales across 10 transactions."
            required
          />
        </div>
      </div>

      <WizardNavigation 
        onPrevious={previousStep}
      />
    </form>
  )
}
