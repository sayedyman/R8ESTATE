"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { TrustCardPreview } from "@/components/onboarding/trust-card-preview"

export default function SuccessPage() {
  const router = useRouter()
  const { trustCardDraft, completeOnboarding, isOnboardingCompleted, userMode } = useOnboardingStore()

  React.useEffect(() => {
    // If somehow they get here without filling basic info, redirect back
    if (!trustCardDraft.fullName && !isOnboardingCompleted) {
      router.replace(ROUTES.ONBOARDING_WIZARD)
    } else if (isOnboardingCompleted) {
      if (userMode === "preview") {
        router.replace(ROUTES.PROFILE + "?preview=true")
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } else {
      // Fire confetti when they reach success page
      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0f172a', '#e2e8f0', '#0ea5e9']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0f172a', '#e2e8f0', '#0ea5e9']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [trustCardDraft.fullName, isOnboardingCompleted, router])

  const handleGoToDashboard = () => {
    completeOnboarding()
    if (userMode === "preview") {
      router.push(ROUTES.PROFILE + "?preview=true")
    } else {
      router.push(ROUTES.DASHBOARD)
    }
  }

  if (!trustCardDraft.fullName || isOnboardingCompleted) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center text-center"
    >
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
          🎉 Congratulations!
        </h1>
        <p className="text-slate-500 text-lg">
          Your Trust Card has been created successfully.
        </p>
      </div>

      <div className="w-full max-w-md my-8 pointer-events-none">
        <TrustCardPreview />
      </div>

      <Button 
        size="lg" 
        className="w-full sm:w-auto min-w-[250px] h-14 text-lg rounded-xl shadow-lg"
        onClick={handleGoToDashboard}
      >
        Go to Dashboard
      </Button>
    </motion.div>
  )
}
