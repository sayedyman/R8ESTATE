"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

export function ReviewStep() {
  const router = useRouter()
  const { isEditMode, setEditMode } = useOnboardingStore()

  const handleDashboard = () => {
    // Go to Dashboard routes to Sign up first
    router.push(`${ROUTES.SIGNUP}?callbackUrl=${encodeURIComponent(ROUTES.DASHBOARD)}`)
  }

  const handlePublish = () => {
    // Publish routes to Publish Trust Card screen directly
    router.push(ROUTES.PUBLISH_TRUST_CARD)
  }

  return (
    <div className="space-y-8 flex flex-col items-center py-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-4 bg-success/10 text-success rounded-full mb-2">
          <QrCode className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Your Trust Card is Ready</h3>
        <p className="text-slate-500 text-base max-w-sm mx-auto">
          Review your card in the preview pane. You can publish it immediately or go to your dashboard to manage it.
        </p>
      </div>
      
      <div className="w-full mt-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
        {isEditMode ? (
          <Button size="lg" className="w-full sm:w-auto min-w-[200px] h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all" onClick={() => {
            setEditMode(false)
            router.push(ROUTES.PROFILE + '?preview=true')
          }}>
            Save Changes
          </Button>
        ) : (
          <>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px] h-12 rounded-xl font-semibold" onClick={handleDashboard}>
              Go to Dashboard
            </Button>
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all" onClick={handlePublish}>
              Publish Trust Card
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
