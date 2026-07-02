"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { SelectionStep } from "./selection-step"
import { useTranslations } from "next-intl"

const strengths = [
  "Client Trust", "Negotiation", "Closing Deals", 
  "Market Expertise", "Fast Response", "Investment Advice"
]

export function StrengthStep() {
  const { trustCardDraft, updateDraft, nextStep, previousStep } = useOnboardingStore()
  const t = useTranslations("onboarding.wizard")

  return (
    <SelectionStep
      description={t("strengthDesc")}
      options={strengths.map(s => ({ value: s, label: t(`strengths.${s}`) }))}
      value={trustCardDraft.biggestStrength || ""}
      onChange={(val) => updateDraft({ biggestStrength: val })}
      onNext={nextStep}
      onPrevious={previousStep}
      searchPlaceholder={t("searchStrength")}
      customInputLabel={t("customStrength")}
      customInputPlaceholder={t("strengthExample")}
    />
  )
}
