"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { WizardNavigation } from "@/components/onboarding/wizard-navigation"

export function ProfileInformationStep() {
  const { trustCardDraft, updateDraft, nextStep, previousStep } = useOnboardingStore()
  const [isManual, setIsManual] = React.useState(!!trustCardDraft.fullName)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const handleLinkedInImport = () => {
    // Mock LinkedIn import mapping
    updateDraft({
      fullName: "Jonathan Davis",
      jobTitle: "Senior Property Consultant",
      company: "Elite Realty",
      yearsOfExperience: "8",
      shortBio: "Specializing in luxury properties and investment advisory with a proven track record of successful negotiations.",
      linkedIn: "https://linkedin.com/in/jonathandavis",
      profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256"
    })
    setIsManual(true)
  }

  if (!isManual) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center py-10">
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-slate-900">Complete your profile faster</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Import your details directly from LinkedIn. You can review and edit everything before publishing.
          </p>
        </div>
        
        <Button 
          onClick={handleLinkedInImport} 
          size="lg" 
          className="w-full max-w-sm flex items-center gap-2 bg-[#0077b5] hover:bg-[#006396] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 h-14"
        >
          <Link className="h-5 w-5" />
          Import from LinkedIn
        </Button>
        
        <div className="flex items-center gap-4 w-full max-w-sm pt-2">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Or</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <button 
          onClick={() => setIsManual(true)}
          className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          Fill it manually
        </button>
        
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            value={trustCardDraft.fullName}
            onChange={(e) => updateDraft({ fullName: e.target.value })}
            placeholder="e.g. Jonathan Davis"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input 
            id="jobTitle" 
            value={trustCardDraft.jobTitle}
            onChange={(e) => updateDraft({ jobTitle: e.target.value })}
            placeholder="e.g. Senior Consultant"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            value={trustCardDraft.company}
            onChange={(e) => updateDraft({ company: e.target.value })}
            placeholder="e.g. Elite Realty"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortBio">Short Bio</Label>
          <Textarea 
            id="shortBio" 
            value={trustCardDraft.shortBio}
            onChange={(e) => updateDraft({ shortBio: e.target.value })}
            className="h-24 resize-none"
            placeholder="Briefly describe your expertise and approach..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn URL (Optional)</Label>
          <Input 
            id="linkedIn" 
            type="url"
            value={trustCardDraft.linkedIn}
            onChange={(e) => updateDraft({ linkedIn: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input 
            id="website" 
            type="url"
            value={trustCardDraft.website}
            onChange={(e) => updateDraft({ website: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
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
