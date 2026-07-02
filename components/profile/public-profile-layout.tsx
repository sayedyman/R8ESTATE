"use client"

import * as React from "react"
import { TrustCardPreview } from "@/components/onboarding/trust-card-preview"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { CheckCircle2, Star, ShieldCheck, MapPin, Award, Building, User, Briefcase, Trophy } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PreviewInfoCard } from "./preview-info-card"

export function PublicProfileLayout({ isOwnerPreview }: { isOwnerPreview?: boolean }) {
  const { trustCardDraft, savedTrustCard, isInlineEditing, tempDraft, updateTempDraft, userMode } = useOnboardingStore()
  
  const baseCard = userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft
  const draft = isInlineEditing && tempDraft ? tempDraft : baseCard

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Sticky Sidebar: Trust Card Preview */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24 z-10">
          {isOwnerPreview && userMode === "preview" && <PreviewInfoCard />}
          <TrustCardPreview />
          
          <div className="mt-6 flex flex-col gap-3">
            {userMode !== "preview" && (
              <>
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold shadow-md transition-colors">
                  Contact Me
                </button>
                <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold shadow-sm transition-colors">
                  Book a Consultation
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          
          {/* Trust Summary & Track Record */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Trust Summary
            </h2>
            
            <div className="bg-slate-50 rounded-xl p-6 md:p-8 text-center mb-2 border border-slate-100 border-dashed">
              <ShieldCheck className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">Metrics & Verification Pending</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Trust metrics, identity verification, and license status will appear here as they become available.
              </p>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              About Me
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed">
              {isInlineEditing ? (
                <Textarea 
                  value={draft.shortBio} 
                  onChange={(e) => updateTempDraft({ shortBio: e.target.value })}
                  className="min-h-[120px] text-sm md:text-base resize-none"
                  placeholder="Write a detailed bio..."
                />
              ) : (
                <p>
                  {draft.shortBio || "This professional is currently completing their detailed biography and professional approach."}
                </p>
              )}
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Specialization</p>
                  {isInlineEditing ? (
                    <Input 
                      value={draft.specialization} 
                      onChange={(e) => updateTempDraft({ specialization: e.target.value })}
                      className="h-8 mt-1 text-sm font-medium"
                      placeholder="e.g. Luxury Properties"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-900">{draft.specialization || "Not specified"}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Company</p>
                  {isInlineEditing ? (
                    <Input 
                      value={draft.company} 
                      onChange={(e) => updateTempDraft({ company: e.target.value })}
                      className="h-8 mt-1 text-sm font-medium"
                      placeholder="e.g. Independent"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-900">{draft.company || "Independent"}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Professional Highlights */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Professional Highlights
            </h2>
            
            <div className="space-y-8">
              {/* Experience */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Building className="h-4 w-4" /> Experience
                </h3>
                {draft.experience ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-base">{draft.experience.jobTitle}</h4>
                    <p className="text-primary font-medium text-sm mb-1">{draft.experience.company}</p>
                    <p className="text-slate-500 text-xs mb-3 font-medium">
                      {draft.experience.startDate} – {draft.experience.endDate}
                    </p>
                    {draft.experience.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {draft.experience.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-100 border-dashed">
                    <p className="text-xs text-slate-500 font-medium">Experience details will be added here.</p>
                  </div>
                )}
              </div>

              {/* Achievement */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4" /> Key Achievement
                </h3>
                {draft.achievement ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-base mb-2">{draft.achievement.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {draft.achievement.description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-100 border-dashed">
                    <p className="text-xs text-slate-500 font-medium">Key achievements will be added here.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Reviews (Placeholder) */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Client Reviews
              </h2>
              <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-slate-100 border-dashed text-center">
              <Star className="h-8 w-8 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">No reviews yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Verified client reviews will appear here once available.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
