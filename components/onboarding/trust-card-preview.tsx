"use client"

import * as React from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react"

import { TrustCardAvatar } from "./trust-card-avatar"
import { TrustCardHeader } from "./trust-card-header"
import { TrustCardHighlights } from "./trust-card-highlights"

export function TrustCardPreview() {
  const { trustCardDraft, savedTrustCard, isInlineEditing, tempDraft, updateTempDraft, userMode } = useOnboardingStore()
  
  const baseCard = userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft
  const draft = isInlineEditing && tempDraft ? tempDraft : baseCard

  const isVerified = draft.verificationStatus === "Verified"

  return (
    <Card className="w-full max-w-md mx-auto bg-white overflow-hidden shadow-xl shadow-slate-200/50 border-slate-200/60 transition-all duration-300 p-0 rounded-3xl flex flex-col relative">
      {/* Unverified Watermark */}
      {!isVerified && (
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
          <p className="text-8xl font-black text-slate-900 -rotate-45 uppercase tracking-widest whitespace-nowrap">Unverified</p>
        </div>
      )}

      <div className={`h-28 w-full relative z-10 ${isVerified ? 'bg-gradient-to-r from-emerald-900 to-emerald-800' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`} />
      
      <div className="px-5 pb-6 relative -mt-12 flex flex-col items-center z-10">
        <TrustCardAvatar 
          profilePhoto={draft.profilePhoto} 
          fullName={draft.fullName}
          isInlineEditing={isInlineEditing}
          onUpdate={updateTempDraft}
        />
        
        <div className="mt-1">
          <TrustCardHeader 
            fullName={draft.fullName}
            jobTitle={draft.jobTitle}
            company={draft.company}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />
        </div>

        {/* Verification Badge */}
        {isVerified ? (
          <div className="mt-3 mb-1 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Professional
          </div>
        ) : (
          <div className="mt-3 mb-1 flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-100">
            <AlertCircle className="w-3.5 h-3.5" />
            Verification Pending
          </div>
        )}

        <div className="w-full mt-2">
          <TrustCardHighlights 
            specialization={draft.specialization}
            biggestStrength={draft.biggestStrength}
            isInlineEditing={isInlineEditing}
            onUpdate={updateTempDraft}
          />
        </div>

        <div className="w-full mt-5 space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 text-center border-y border-slate-100 py-5">
            <div>
              <p className="text-2xl font-black text-slate-900">{draft.trustScore || "98"}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Trust Score</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{draft.yearsOfExperience || "5"}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Years Exp.</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">120+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Deals Closed</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">4.9/5</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Client Rating</p>
            </div>
          </div>

          {/* Location & Response Time */}
          <div className="text-center space-y-1.5">
            <p className="text-[13px] text-slate-500 font-medium">Location: <strong className="text-slate-900">Dubai, UAE</strong></p>
            <p className="text-[13px] text-slate-500 font-medium">Response Time: <strong className="text-slate-900">Within 1 hour</strong></p>
          </div>

          {/* Badges / Verification Preview */}
          {draft.verifications && draft.verifications.filter(v => v.status === 'Verified').length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {draft.verifications.filter(v => v.status === 'Verified').slice(0, 3).map((v) => (
                <div key={v.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                  <Trophy className="w-3.5 h-3.5" />
                  {v.title}
                </div>
              ))}
            </div>
          )}

          {/* QR Code Placeholder */}
          <div className="pt-5 flex flex-col items-center justify-center">
            <div className="w-28 h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-3 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="square" strokeLinejoin="miter" d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6zM9 3v6M15 9h-6M21 9v6M9 21v-6M3 9h6M9 15h6M15 21v-6" /></svg>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-4">Scan to Connect</p>
          </div>
        </div>
      </div>
      {userMode === "preview" && (
        <div className="bg-slate-50 border-t border-slate-100 py-3 text-center mt-auto z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Powered by R8ESTATE
          </p>
        </div>
      )}
    </Card>
  )
}
