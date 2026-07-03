"use client"

import * as React from "react"
import { useOnboardingStore, TrustCardDraft } from "@/stores/onboarding-store"
import { TrustCardService, mapRowToDraft, generateSlug } from "@/lib/services/trust-card.service"


export function usePublicTrustCard(requestedSlug: string): {
  card: TrustCardDraft | null
  isLoading: boolean
} {
  const { trustCardDraft, userMode } = useOnboardingStore()
  const [card, setCard] = React.useState<TrustCardDraft | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    async function loadCard() {
      setIsLoading(true)
      try {
        const trustCardService = new TrustCardService()
        // 1. Fetch directly from Supabase by slug
        const cardRow = await trustCardService.getTrustCardBySlug(requestedSlug)
        if (cardRow) {
          if (active) {
            setCard(mapRowToDraft(cardRow))
            setIsLoading(false)
          }
          return
        }

        // 2. Fallback to local onboarding store draft only if user mode is "preview"
        if (userMode === "preview" && trustCardDraft && trustCardDraft.fullName) {
          const previewSlug = generateSlug(trustCardDraft.fullName)
          if (previewSlug === requestedSlug) {
            if (active) {
              setCard(trustCardDraft)
              setIsLoading(false)
            }
            return
          }
        }

        if (active) {
          setCard(null)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error loading public trust card:", err)
        if (active) {
          setCard(null)
          setIsLoading(false)
        }
      }
    }

    loadCard()

    return () => {
      active = false
    }
  }, [requestedSlug, userMode, trustCardDraft])

  return { card, isLoading }
}
