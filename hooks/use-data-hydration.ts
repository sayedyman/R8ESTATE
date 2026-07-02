import { useSession } from "next-auth/react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { TrustCardService, mapRowToDraft } from "@/lib/services/trust-card.service"
import { useEffect, useState } from "react"

/**
 * Client-side hook to hydrate the Zustand store from Supabase
 * when an authenticated session is active.
 */
export function useDataHydration() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (status === "authenticated" && session?.user?.id && !isLoading) {
        setIsLoading(true)
        try {
          const trustCardService = new TrustCardService()
          const cardRow = await trustCardService.getTrustCardByUserId(session.user.id)
          if (cardRow) {
            const draft = mapRowToDraft(cardRow)
            useOnboardingStore.setState({
              savedTrustCard: draft,
              selectedGoal: cardRow.selected_goal as any,
              userMode: "registered",
              isOnboardingCompleted: true
            })
          }
        } catch (error) {
          console.error("Error hydrating user data from Supabase:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    loadData()
  }, [status, session])

  return { isLoading }
}
