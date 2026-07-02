"use client"

import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { usePublicTrustCard } from "@/hooks/use-public-trust-card"
import { Card } from "@/components/ui/card"
import { Trophy, Building2, Globe, Phone, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { Linkedin } from "@/components/ui/social-icons"
import { TrustCardAvatar } from "@/components/onboarding/trust-card-avatar"
import { TrustCardHeader } from "@/components/onboarding/trust-card-header"
import { TrustCardHighlights } from "@/components/onboarding/trust-card-highlights"
import { AnalyticsService, AnalyticsEventType } from "@/lib/services/analytics.service"
import { useTranslations } from "next-intl"

interface PublicProfileClientProps {
  slug: string
}

export function PublicProfileClient({ slug }: PublicProfileClientProps) {
  const { card, isLoading } = usePublicTrustCard(slug)
  const t = useTranslations("profile.publicProfile")

  // Track profile view on load (or qr_scan if referred via QR)
  React.useEffect(() => {
    if (!card || !card.userId) return

    const trackLoad = async () => {
      try {
        let visitorId = localStorage.getItem("r8_visitor_id")
        if (!visitorId) {
          visitorId = Math.random().toString(36).substring(2, 15)
          localStorage.setItem("r8_visitor_id", visitorId)
        }

        const isQr = window.location.search.includes("src=qr") || window.location.search.includes("qr=true")
        const analyticsService = new AnalyticsService()
        await analyticsService.trackEvent({
          ownerUserId: card.userId!,
          eventType: isQr ? "qr_scan" : "profile_view",
          source: isQr ? "qr" : "web",
          visitorId
        })
      } catch (err) {
        console.error("Failed to track profile load:", err)
      }
    }

    trackLoad()
  }, [card])

  const trackClick = async (eventType: AnalyticsEventType) => {
    if (!card || !card.userId) return
    try {
      const visitorId = localStorage.getItem("r8_visitor_id") || undefined
      const analyticsService = new AnalyticsService()
      await analyticsService.trackEvent({
        ownerUserId: card.userId,
        eventType,
        source: "web",
        visitorId
      })
    } catch (err) {
      console.error(`Failed to track click event: ${eventType}`, err)
    }
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

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Verification Profile Banner */}
      {card.verificationStatus === "Verified" ? (
        <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-3 relative z-20 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-start sm:items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-slate-900">Verification Status</p>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-bold">Identity Verified</span>
              </div>
              <p className="text-[13px] text-slate-600 font-medium leading-snug">
                This professional has completed R8ESTATE&apos;s identity verification process. The information displayed on this profile has been independently verified.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/90 border-b border-amber-100 px-4 py-3 relative z-20 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-start sm:items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-slate-900">Verification Status</p>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-bold">Identity Verification Pending</span>
              </div>
              <p className="text-[13px] text-slate-600 font-medium leading-snug">
                This professional has not yet completed R8ESTATE&apos;s identity verification process. The information displayed on this profile has not yet been independently verified by R8ESTATE.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header Background */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-slate-900 to-slate-800 w-full relative" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-20 md:-mt-28">
        
        {/* Hero Trust Card */}
        <Card className="w-full bg-white overflow-hidden shadow-xl shadow-slate-200/50 border-slate-200/60 p-4 md:p-5 mb-5 rounded-3xl">
          <div className="flex flex-col items-center mb-3">
            <TrustCardAvatar 
              profilePhoto={card.profilePhoto} 
              fullName={card.fullName}
            />
            
            <TrustCardHeader 
              fullName={card.fullName}
              jobTitle={card.jobTitle}
              company={card.company}
            />
          </div>

          <TrustCardHighlights 
            specialization={card.specialization}
            biggestStrength={card.biggestStrength}
          />
        </Card>

        {/* Highlighted Achievement Section */}
        {card.achievement && card.achievement.title && (
          <Card className="w-full bg-amber-50/80 overflow-hidden shadow-md shadow-amber-100/50 border border-amber-200/60 p-5 md:p-6 mb-5 rounded-3xl relative">
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2">{card.achievement.title}</h3>
                {card.achievement.description && (
                  <p className="text-slate-700 text-[15px] leading-relaxed font-medium">
                    {card.achievement.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-5">
            
            {/* About Section */}
            {card.shortBio && (
              <section className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t("about")}</h2>
                <p className="text-slate-600 leading-relaxed text-[15px]">{card.shortBio}</p>
              </section>
            )}

            {/* Experience Section */}
            {card.experience && (card.experience.jobTitle || card.experience.company) && (
              <section className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">{t("experience")}</h2>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{card.experience.jobTitle}</h3>
                    <p className="text-primary font-medium mb-1">{card.experience.company}</p>
                    <p className="text-slate-400 text-sm font-medium mb-3">
                      {card.experience.startDate} - {card.experience.endDate}
                    </p>
                    {card.experience.description && (
                      <p className="text-slate-600 text-[15px] leading-relaxed">
                        {card.experience.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
            
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-1 space-y-5">
            
            {/* Contact Section */}
            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t("contact")}</h2>
              <div className="space-y-2">
                {card.phoneNumber && (
                  <a 
                    href={`tel:${card.phoneNumber.replace(/[^\d+]/g, '')}`} 
                    onClick={() => trackClick("phone_click")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-white border border-slate-100 text-slate-500 flex items-center justify-center shrink-0 shadow-sm transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("phone")}</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{card.phoneNumber}</p>
                    </div>
                  </a>
                )}
                {card.linkedIn && (
                  <a 
                    href={card.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => trackClick("linkedin_click")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#0A66C2]/10 group-hover:bg-white border border-transparent group-hover:border-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-[#0A66C2]/60 uppercase tracking-wider mb-0.5">LinkedIn</p>
                      <p className="text-sm font-semibold text-[#0A66C2] truncate">{card.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}</p>
                    </div>
                  </a>
                )}
                {card.website && (
                  <a 
                    href={card.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => trackClick("website_click")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-white border border-slate-100 text-slate-500 flex items-center justify-center shrink-0 shadow-sm transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("website")}</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{card.website.replace(/^https?:\/\/(www\.)?/, '')}</p>
                    </div>
                  </a>
                )}
              </div>
              
              {/* Optional Footer Branding */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t("poweredBy")}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
