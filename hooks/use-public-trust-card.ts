"use client"

import * as React from "react"
import { useOnboardingStore, TrustCardDraft } from "@/stores/onboarding-store"

/**
 * Utility to generate a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Hook to retrieve the public trust card data based on the requested slug.
 * In a real backend, this would fetch from an API: `fetch(/api/users/${slug})`.
 * For the MVP, it hydrates from the local onboarding store.
 */
export function usePublicTrustCard(requestedSlug: string): {
  card: TrustCardDraft | null
  isLoading: boolean
} {
  const { trustCardDraft, savedTrustCard, userMode } = useOnboardingStore()
  const [card, setCard] = React.useState<TrustCardDraft | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate a tiny network delay for realism
    const timer = setTimeout(() => {
      let activeCard: TrustCardDraft | null = null

      if (userMode === "registered" && savedTrustCard) {
        activeCard = savedTrustCard
      } else if (userMode === "preview" && trustCardDraft) {
        activeCard = trustCardDraft
      }

      // Check if the requested slug matches the active card's generated slug
      if (activeCard && activeCard.fullName) {
        const generatedSlug = generateSlug(activeCard.fullName)
        if (generatedSlug === requestedSlug) {
          setCard(activeCard)
        } else {
          setCard(null)
        }
      } else {
        setCard(null)
      }

      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [requestedSlug, userMode, savedTrustCard, trustCardDraft])

  return { card, isLoading }
}
