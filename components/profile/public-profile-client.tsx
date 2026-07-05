"use client"

import * as React from "react"
import { notFound } from "next/navigation"
import { usePublicTrustCard } from "@/hooks/use-public-trust-card"
import { Card } from "@/components/ui/card"
import { Trophy, Building2, Globe, Phone, Mail, AlertCircle, CheckCircle2, Star } from "lucide-react"
import { Linkedin } from "@/components/ui/social-icons"
import { TrustCardAvatar } from "@/components/onboarding/trust-card-avatar"
import { TrustCardHeader } from "@/components/onboarding/trust-card-header"
import { TrustCardHighlights } from "@/components/onboarding/trust-card-highlights"
import { useTranslations } from "@/hooks/use-translations"

interface PublicProfileClientProps {
  slug: string
}

export function PublicProfileClient({ slug }: PublicProfileClientProps) {
  const { card, isLoading, isOwner } = usePublicTrustCard(slug)
  const t = useTranslations("profile.publicProfile")

  // Track profile view on load (mock)
  React.useEffect(() => {
    if (!card) return
    console.log("Mock tracking profile view for:", slug)
  }, [card, slug])

  const trackClick = async (eventType: string) => {
    if (!card) return
    console.log("Mock tracking click event:", eventType)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!card) {
    notFound()
  }

  const isVerified = card.verificationStatus === "Verified"
  // Guests see the unverified state. Owners do not.
  const showUnverifiedState = !isOwner && !isVerified

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-8 md:gap-12 items-center">
          
          {/* Top Summary Card */}
          <div className="w-full shrink-0 flex flex-col gap-5">
            <Card className="w-full bg-white overflow-hidden shadow-xl shadow-slate-200/50 border-slate-200/60 p-0 rounded-3xl flex flex-col relative">
              {/* Unverified Watermark */}
              {showUnverifiedState && (
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                  <p className="text-[150px] font-black text-slate-900 -rotate-12 uppercase tracking-widest whitespace-nowrap">Unverified</p>
                </div>
              )}

              <div className={`h-24 md:h-32 w-full relative z-10 ${!showUnverifiedState ? 'bg-gradient-to-r from-emerald-900 to-emerald-800' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`} />
              
              <div className="px-6 md:px-10 pb-8 relative -mt-12 md:-mt-16 flex flex-col md:flex-row gap-8 md:gap-12 z-10">
                
                {/* Left: Identity */}
                <div className="flex flex-col items-center md:items-start flex-1">
                  <TrustCardAvatar 
                    profilePhoto={card.profilePhoto} 
                    fullName={card.fullName}
                  />
                  
                  <div className="mt-3 w-full text-center md:text-left">
                    <TrustCardHeader 
                      fullName={card.fullName}
                      jobTitle={card.jobTitle}
                      company={card.company}
                    />
                  </div>

                  {/* Verification Badge */}
                  <div className="mt-4 flex justify-center md:justify-start">
                    {!showUnverifiedState ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Professional
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-100">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Verification Pending
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-4">
                    <TrustCardHighlights 
                      specialization={card.specialization}
                      biggestStrength={card.biggestStrength}
                    />
                  </div>

                  {/* Location & Response Time */}
                  <div className="mt-6 space-y-1.5 text-center md:text-left">
                    <p className="text-[13px] text-slate-500 font-medium">Location: <strong className="text-slate-900">Dubai, UAE</strong></p>
                    <p className="text-[13px] text-slate-500 font-medium">Response Time: <strong className="text-slate-900">Within 1 hour</strong></p>
                  </div>
                </div>

                {/* Right: Metrics & QR */}
                <div className="flex flex-col flex-1 pt-2 md:pt-16">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-y md:border-y-0 md:border-b border-slate-100 py-5 md:py-0 md:pb-6">
                    <div>
                      <p className="text-2xl font-black text-slate-900">{card.trustScore || "98"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Trust Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">{card.yearsOfExperience || "5"}</p>
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

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                    {/* Badges / Verification Preview */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {card.verifications && card.verifications.filter(v => v.status === 'Verified').slice(0, 3).map((v) => (
                        <div key={v.id} className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100 shadow-sm">
                          <Trophy className="w-4 h-4" />
                          {v.title}
                        </div>
                      ))}
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-2.5 shadow-sm">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="square" strokeLinejoin="miter" d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6zM9 3v6M15 9h-6M21 9v6M9 21v-6M3 9h6M9 15h6M15 21v-6" /></svg>
                      </div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-3">Scan to Connect</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-100 py-3 text-center mt-auto z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t("poweredBy")}
                </p>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col gap-6">
            


            {/* About Section */}
            {card.shortBio && (
              <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">{t("about")}</h2>
                <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">{card.shortBio}</p>
              </section>
            )}

            {/* Experience Section */}
            {card.experiences && card.experiences.length > 0 && (
              <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{t("experience")}</h2>
                  {card.experiences.length > 1 && (
                    <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                      View All ({card.experiences.length})
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  {card.experiences.slice(0, 1).map((exp) => (
                    <div key={exp.id} className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{exp.jobTitle}</h3>
                        <p className="text-primary font-medium text-[15px] mb-1">{exp.company}</p>
                        <p className="text-slate-400 text-sm font-medium mb-3">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-slate-600 text-[15px] leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contact Information & Socials Grid */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t("contact")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {card.phoneNumber && (
                  <a 
                    href={`tel:${card.phoneNumber.replace(/[^\d+]/g, '')}`} 
                    onClick={() => trackClick("phone_click")}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-slate-600 flex items-center justify-center shrink-0 shadow-sm group-hover:text-primary transition-colors">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("phone")}</p>
                      <p className="text-[15px] font-semibold text-slate-700 truncate">{card.phoneNumber}</p>
                    </div>
                  </a>
                )}
                {card.linkedIn && (
                  <a 
                    href={card.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => trackClick("linkedin_click")}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition-colors border border-blue-100/50 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-[#0A66C2] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                      <Linkedin className="w-4.5 h-4.5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-[#0A66C2]/60 uppercase tracking-wider mb-0.5">LinkedIn</p>
                      <p className="text-[15px] font-semibold text-[#0A66C2] truncate">{card.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}</p>
                    </div>
                  </a>
                )}
                {card.website && (
                  <a 
                    href={card.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => trackClick("website_click")}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-slate-600 flex items-center justify-center shrink-0 shadow-sm group-hover:text-primary transition-colors">
                      <Globe className="w-4.5 h-4.5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("website")}</p>
                      <p className="text-[15px] font-semibold text-slate-700 truncate">{card.website.replace(/^https?:\/\/(www\.)?/, '')}</p>
                    </div>
                  </a>
                )}
              </div>
            </section>

            {/* Client Reviews */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {t("clientReviews")}
                </h2>
                {card.testimonials && card.testimonials.length > 1 && (
                  <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    View All ({card.testimonials.length})
                  </button>
                )}
              </div>
              
              {!card.testimonials || card.testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed text-center">
                  <Star className="h-10 w-10 text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">No reviews yet</h3>
                  <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Verified client reviews will appear here once available.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {card.testimonials.slice(0, 1).map((test) => (
                    <div key={test.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < (test.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="text-slate-700 italic leading-relaxed mb-6">"{test.quote}"</p>
                      <div>
                        <p className="font-bold text-slate-900">{test.clientName}</p>
                        <p className="text-sm text-slate-500">{test.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
      </div>
    </div>
  )
}
