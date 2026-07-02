"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { TrustCardPreview } from "@/components/onboarding/trust-card-preview"
import { QrCode, Copy, Download, Share2, CheckCircle2, ShieldCheck, TrendingUp, Eye } from "lucide-react"
import { motion } from "framer-motion"

export default function PublishPage() {
  const router = useRouter()
  const { trustCardDraft, completeOnboarding } = useOnboardingStore()
  const [publishState, setPublishState] = React.useState<"idle" | "publishing" | "success">("idle")

  const handleCompleteProfile = () => {
    router.push(`${ROUTES.SIGNUP}?callbackUrl=${encodeURIComponent(ROUTES.DASHBOARD)}`)
  }

  const handleContinuePublishing = () => {
    // Publish without an account
    setPublishState("publishing")
    completeOnboarding()
    
    setTimeout(() => {
      setPublishState("success")
      setTimeout(() => {
        router.push(`${ROUTES.PROFILE}?preview=true`)
      }, 1000)
    }, 1500)
  }

  if (!trustCardDraft.fullName) {
    // If accessed directly without data
    if (typeof window !== "undefined") {
      router.replace(ROUTES.ONBOARDING_GOAL)
    }
    return null
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12 items-start justify-center min-h-[calc(100vh-80px)]">
      
      {/* Left side: Preview & Actions */}
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Trust Card</h2>
        <div className="w-full max-w-md pointer-events-none">
          <TrustCardPreview />
        </div>
        
        <div className="w-full max-w-md mt-6 bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <QrCode className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <p className="text-sm font-semibold">Share via QR</p>
              <p className="text-xs text-slate-500">Scan to view profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              title="Copy Link"
              onClick={() => {
                const slug = trustCardDraft.fullName ? trustCardDraft.fullName.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") : "preview"
                navigator.clipboard.writeText(`${window.location.origin}/u/${slug}`)
                alert("Link copied!")
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Download"><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" title="Share"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Right side: Upgrade Upsell */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6 text-blue-200">
              <ShieldCheck className="h-4 w-4" />
              Unlock Full Potential
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Get more clients with a verified profile.
            </h1>
            
            <p className="text-slate-300 mb-8 text-lg">
              Create an account to manage your Trust Card, get verified, and access premium features.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
                <div>
                  <p className="font-semibold text-white">Higher Trust Score</p>
                  <p className="text-sm text-slate-400">Boost your credibility with verified badges.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-6 w-6 text-blue-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Better Visibility</p>
                  <p className="text-sm text-slate-400">Appear higher in client searches.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-purple-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Analytics Dashboard</p>
                  <p className="text-sm text-slate-400">Track profile views and lead conversions.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-bold bg-white text-slate-900 hover:bg-slate-100" 
                onClick={handleCompleteProfile}
              >
                Complete My Profile
              </Button>
              
              <Button 
                variant={publishState === "success" ? "default" : "ghost"} 
                size="lg" 
                className={`w-full h-12 hover:text-white hover:bg-white/10 transition-all ${
                  publishState === "success" 
                    ? "bg-success/20 text-success hover:bg-success/30 hover:text-success border border-success/30" 
                    : publishState === "publishing"
                    ? "text-blue-300"
                    : "text-slate-400"
                }`}
                onClick={handleContinuePublishing}
                disabled={publishState !== "idle"}
              >
                {publishState === "idle" && "Continue Publishing without account"}
                {publishState === "publishing" && "Publishing your Trust Card..."}
                {publishState === "success" && "✓ Your Trust Card is now live."}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
