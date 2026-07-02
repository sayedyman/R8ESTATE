"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { SelectionStep } from "./selection-step"

const specializations = [
  "Luxury Property", "Investment Advisor", "Commercial Real Estate", 
  "Off-Plan Sales", "North Coast Specialist", "New Cairo Specialist"
]

export function SpecializationStep() {
  const { trustCardDraft, updateDraft, nextStep } = useOnboardingStore()

  return (
    <SelectionStep
      description="Choose one specialization or create your own."
      options={specializations}
      value={trustCardDraft.specialization || ""}
      onChange={(val) => updateDraft({ specialization: val })}
      onNext={nextStep}
      searchPlaceholder="Search or type your specialization..."
      customInputLabel="Custom Specialization"
      customInputPlaceholder="e.g. Waterfront Properties"
    />
  )
}
