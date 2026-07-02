"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { useAuthSync } from "@/hooks/use-auth-sync"

export default function WelcomePage() {
  const router = useRouter()
  const { selectedGoal, isOnboardingCompleted, userMode } = useOnboardingStore()
  
  // Automatically sync local onboarding draft to Supabase on login
  useAuthSync()

  React.useEffect(() => {
    if (isOnboardingCompleted) {
      if (userMode === "preview") {
        router.replace(ROUTES.PROFILE + "?preview=true")
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } else if (!selectedGoal) {
      router.replace(ROUTES.ONBOARDING_GOAL)
    }
  }, [selectedGoal, isOnboardingCompleted, router])

  const handleStart = () => {
    router.push(ROUTES.ONBOARDING_WIZARD)
  }

  if (isOnboardingCompleted || !selectedGoal) return null

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto text-center flex flex-col items-center"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
        Welcome!
      </h1>
      
      <p className="text-slate-500 text-lg sm:text-xl mb-12 leading-relaxed max-w-md">
        Let's build your professional Trust Card in a few quick steps.
      </p>

      <Button 
        size="lg" 
        className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        onClick={handleStart}
      >
        Create My Trust Card
      </Button>
    </motion.div>
  )
}
