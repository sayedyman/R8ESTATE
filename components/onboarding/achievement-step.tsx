"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WizardNavigation } from "@/components/onboarding/wizard-navigation"
import { useTranslations } from "next-intl"

export function AchievementStep() {
  const { trustCardDraft, updateDraft, nextStep, previousStep } = useOnboardingStore()
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
    nextStep()
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
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
        nextLabel="Review Trust Card"
      />
    </form>
  )
}
