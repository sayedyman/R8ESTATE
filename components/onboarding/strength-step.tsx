"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { SelectionStep } from "./selection-step"

const strengths = [
  "Client Trust", "Negotiation", "Closing Deals", 
  "Market Expertise", "Fast Response", "Investment Advice"
]

export function StrengthStep() {
  const { trustCardDraft, updateDraft, nextStep, previousStep } = useOnboardingStore()

  return (
    <SelectionStep
      description="Select your primary strength or create your own."
      options={strengths}
      value={trustCardDraft.biggestStrength || ""}
      onChange={(val) => updateDraft({ biggestStrength: val })}
      onNext={nextStep}
      onPrevious={previousStep}
      searchPlaceholder="Search or type your strength..."
      customInputLabel="Custom Strength"
      customInputPlaceholder="e.g. Data-Driven Insights"
    />
  )
}
