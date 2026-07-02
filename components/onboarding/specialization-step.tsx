"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { SelectionStep } from "./selection-step"
import { useTranslations } from "next-intl"

const specializations = [
  "Luxury Property", "Investment Advisor", "Commercial Real Estate", 
  "Off-Plan Sales", "North Coast Specialist", "New Cairo Specialist"
]

export function SpecializationStep() {
  const { trustCardDraft, updateDraft, nextStep } = useOnboardingStore()
  const t = useTranslations("onboarding.wizard")

  return (
    <SelectionStep
      description={t("specializationDesc")}
      options={specializations.map(s => ({ value: s, label: t(`specializations.${s}`) }))}
      value={trustCardDraft.specialization || ""}
      onChange={(val) => updateDraft({ specialization: val })}
      onNext={nextStep}
      searchPlaceholder={t("searchSpecialization")}
      customInputLabel={t("customSpecialization")}
      customInputPlaceholder={t("specializationExample")}
    />
  )
}
