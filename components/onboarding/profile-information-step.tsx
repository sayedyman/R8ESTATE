"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { WizardNavigation } from "@/components/onboarding/wizard-navigation"
import { CvImportModal } from "@/components/onboarding/cv-import-modal"
import { AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

export function ProfileInformationStep() {
  const t = useTranslations("onboarding.wizard")
  const { trustCardDraft, updateDraft, nextStep, previousStep } = useOnboardingStore()
  const [isManual, setIsManual] = React.useState(!!trustCardDraft.fullName)
  const [showCvModal, setShowCvModal] = React.useState(false)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const handleCVImportClick = () => {
    setShowCvModal(true)
  }

  const handleCvSuccess = () => {
    setShowCvModal(false)
    setIsManual(true)
  }

  if (!isManual) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center py-10">
        {/* CV Import Modal */}
        <AnimatePresence>
          {showCvModal && (
            <CvImportModal
              onClose={() => setShowCvModal(false)}
              onSuccess={handleCvSuccess}
            />
          )}
        </AnimatePresence>

        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-slate-900">{t("importTitle")}</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            {t("importSubtitle")}
          </p>
        </div>
        
        <Button 
          onClick={handleCVImportClick} 
          size="lg" 
          className="w-full max-w-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 h-14"
        >
          <FileText className="h-5 w-5 rtl:flip" />
          {t("importFromCv")}
        </Button>
        
        <div className="relative w-full max-w-sm my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium">{t("or")}</span>
          </div>
        </div>

        <Button 
          onClick={() => setIsManual(true)}
          variant="outline"
          size="lg"
          className="w-full max-w-sm text-slate-600 h-14"
        >
          {t("fillManually")}
        </Button>
        
        <div className="w-full mt-8">
          <WizardNavigation 
            onPrevious={previousStep}
            hideNext={true}
          />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t("fullName")}</Label>
          <Input 
            id="fullName" 
            value={trustCardDraft.fullName}
            onChange={(e) => updateDraft({ fullName: e.target.value })}
            placeholder="e.g. Jonathan Davis"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">{t("jobTitle")}</Label>
          <Input 
            id="jobTitle" 
            value={trustCardDraft.jobTitle}
            onChange={(e) => updateDraft({ jobTitle: e.target.value })}
            placeholder="e.g. Senior Consultant"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">{t("company")}</Label>
          <Input 
            id="company" 
            value={trustCardDraft.company}
            onChange={(e) => updateDraft({ company: e.target.value })}
            placeholder="e.g. Elite Realty"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">{t("yearsOfExperience")}</Label>
          <Input 
            id="yearsOfExperience" 
            type="number"
            min="0"
            value={trustCardDraft.yearsOfExperience}
            onChange={(e) => updateDraft({ yearsOfExperience: e.target.value })}
            placeholder="e.g. 5"
            required
          />
        </div>
        <div className="space-y-2 col-span-full">
          <Label htmlFor="shortBio">{t("shortBio")}</Label>
          <Textarea 
            id="shortBio" 
            value={trustCardDraft.shortBio}
            onChange={(e) => updateDraft({ shortBio: e.target.value })}
            className="h-24 resize-none"
            placeholder="Briefly describe your expertise and approach..."
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="linkedIn">{t("linkedIn")}</Label>
          <Input 
            id="linkedIn" 
            type="url"
            value={trustCardDraft.linkedIn}
            onChange={(e) => updateDraft({ linkedIn: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">{t("website")}</Label>
          <Input 
            id="website" 
            type="url"
            value={trustCardDraft.website}
            onChange={(e) => updateDraft({ website: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
          <Input 
            id="phoneNumber" 
            type="tel"
            value={trustCardDraft.phoneNumber}
            onChange={(e) => updateDraft({ phoneNumber: e.target.value })}
            placeholder="+1 234 567 8900"
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
