"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WizardNavigation } from "@/components/onboarding/wizard-navigation"
import { useTranslations } from "next-intl"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const parseDate = (dateStr: string) => {
  if (!dateStr || dateStr === "Present") return { month: "", year: "" };
  const parts = dateStr.split(" ");
  return { month: parts[0] || "", year: parts[1] || "" };
};

export function ExperienceStep() {
  const { trustCardDraft, updateDraft, nextStep, previousStep } = useOnboardingStore()
  const t = useTranslations("onboarding.wizard")

  const experience = trustCardDraft.experience || {
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: ""
  }

  const start = parseDate(experience.startDate);
  const end = parseDate(experience.endDate);
  const isPresent = experience.endDate === "Present";

  const handleChange = (field: string, value: string) => {
    updateDraft({
      experience: {
        ...experience,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="expJobTitle">{t("jobTitle")}</Label>
          <Input 
            id="expJobTitle" 
            value={experience.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            placeholder="e.g. Senior Broker"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="expCompany">{t("company")}</Label>
          <Input 
            id="expCompany" 
            value={experience.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="e.g. Elite Realty"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("startDate")}</Label>
          <div className="flex gap-3">
            <select 
              className="flex h-10 w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={start.month}
              onChange={(e) => handleChange("startDate", `${e.target.value} ${start.year}`.trim())}
              required
            >
              <option value="" disabled>{t("month")}</option>
              {MONTHS.map(m => <option key={m} value={m}>{t(`months.${m}`)}</option>)}
            </select>
            <select 
              className="flex h-10 w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={start.year}
              onChange={(e) => handleChange("startDate", `${start.month} ${e.target.value}`.trim())}
              required
            >
              <option value="" disabled>{t("year")}</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("endDate")}</Label>
          <div className="flex flex-wrap items-center gap-3">
            <select 
              className="flex h-10 w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={end.month}
              onChange={(e) => handleChange("endDate", `${e.target.value} ${end.year}`.trim())}
              disabled={isPresent}
              required={!isPresent}
            >
              <option value="" disabled>{t("month")}</option>
              {MONTHS.map(m => <option key={m} value={m}>{t(`months.${m}`)}</option>)}
            </select>
            <select 
              className="flex h-10 w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={end.year}
              onChange={(e) => handleChange("endDate", `${end.month} ${e.target.value}`.trim())}
              disabled={isPresent}
              required={!isPresent}
            >
              <option value="" disabled>{t("year")}</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="flex items-center gap-2 ml-2">
              <input 
                type="checkbox" 
                id="present" 
                checked={isPresent} 
                onChange={(e) => handleChange("endDate", e.target.checked ? "Present" : "")} 
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary accent-primary"
              />
              <Label htmlFor="present" className="text-sm font-normal cursor-pointer m-0">{t("present")}</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="expDescription">{t("shortDescription")}</Label>
          <Textarea 
            id="expDescription" 
            value={experience.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="h-24 resize-none"
            placeholder="Briefly describe your role and achievements..."
          />
        </div>
      </div>

      <WizardNavigation 
        onPrevious={previousStep}
        nextLabel="Next Step"
      />
    </form>
  )
}
