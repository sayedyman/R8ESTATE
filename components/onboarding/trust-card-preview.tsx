"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Card } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { TrustCardAvatar } from "./trust-card-avatar"
import { TrustCardHeader } from "./trust-card-header"
import { TrustCardHighlights } from "./trust-card-highlights"
import { TrustCardExperience } from "./trust-card-experience"
import { TrustCardAchievement } from "./trust-card-achievement"
import { TrustCardSocials } from "./trust-card-socials"

export function TrustCardPreview() {
  const { trustCardDraft, savedTrustCard, isInlineEditing, tempDraft, updateTempDraft, userMode } = useOnboardingStore()
  
  const baseCard = userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft
  const draft = isInlineEditing && tempDraft ? tempDraft : baseCard

  return (
    <Card className="w-full max-w-md mx-auto bg-white overflow-hidden shadow-xl shadow-slate-200/50 border-slate-200/60 transition-all duration-300 p-0 gap-0">
      <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 w-full relative" />
      
      <div className="px-6 pb-6 relative -mt-12">
        <div className="flex flex-col items-center mb-4">
          <TrustCardAvatar 
            profilePhoto={draft.profilePhoto} 
            fullName={draft.fullName}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />
          
          <TrustCardHeader 
            fullName={draft.fullName}
            jobTitle={draft.jobTitle}
            company={draft.company}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />
        </div>

        <TrustCardHighlights 
          specialization={draft.specialization}
          biggestStrength={draft.biggestStrength}
          isInlineEditing={isInlineEditing}
          onUpdate={updateTempDraft}
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About</h3>
            {isInlineEditing ? (
              <Textarea 
                value={draft.shortBio || ""} 
                onChange={(e) => updateTempDraft({ shortBio: e.target.value })}
                className="text-sm min-h-[80px] resize-none"
                placeholder="Write a short bio..."
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed min-h-[40px]">
                {draft.shortBio || "Your short bio will appear here..."}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm border-t border-slate-100 pt-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
              <Briefcase className="h-4 w-4" />
            </div>
            {isInlineEditing ? (
              <div className="flex items-center gap-2">
                <p className="text-slate-500 text-xs">Experience</p>
                <Input 
                  value={draft.yearsOfExperience || ""} 
                  onChange={(e) => updateTempDraft({ yearsOfExperience: e.target.value })}
                  className="h-7 w-20 text-sm px-2"
                  placeholder="Years"
                />
              </div>
            ) : (
              <div>
                <p className="text-slate-500 text-xs">Experience</p>
                <p className="font-medium text-slate-700">
                  {draft.yearsOfExperience ? `${draft.yearsOfExperience} Years` : "-"}
                </p>
              </div>
            )}
          </div>

          <TrustCardExperience 
            experience={draft.experience}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />
          
          <TrustCardAchievement 
            achievement={draft.achievement}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />

          <TrustCardSocials 
            linkedIn={draft.linkedIn}
            website={draft.website}
            phoneNumber={draft.phoneNumber}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />
        </div>
      </div>

      {userMode === "preview" && (
        <div className="bg-slate-50 border-t border-slate-100 py-2.5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Powered by R8ESTATE
          </p>
        </div>
      )}
    </Card>
  )
}
