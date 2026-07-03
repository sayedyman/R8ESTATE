import { useSession } from "next-auth/react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { saveOnboardingResultAction } from "@/lib/actions/onboarding.actions"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"

/**
 * Custom hook to sync Zustand client-side onboarding drafts to Supabase
 * when an authenticated session is active but the user's backend profile
 * indicates onboarding is incomplete.
 */
export function useAuthSync() {
  const { data: session, status, update } = useSession()
  const { trustCardDraft, savePreviewToPermanent } = useOnboardingStore()
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function sync() {
      if (
        status === "authenticated" &&
        session?.user &&
        !session.user.isOnboardingCompleted &&
        trustCardDraft.fullName &&
        !isSyncing
      ) {
        setIsSyncing(true)
        try {
          console.log("Authenticating user session detected. Syncing draft card data to Supabase...")
          
          // Save the draft Trust Card and update user table
          await saveOnboardingResultAction(trustCardDraft)
          
          // Save Zustand draft locally and flag registered state
          savePreviewToPermanent()
          
          // Reload the NextAuth session so session.user.isOnboardingCompleted is updated to true
          await update({ isOnboardingCompleted: true })
          
          console.log("Sync complete. Redirecting to Dashboard.")
          router.replace(ROUTES.DASHBOARD)
        } catch (error) {
          console.error("Error synchronizing onboarding data with backend database:", error)
        } finally {
          setIsSyncing(false)
        }
      }
    }
    sync()
  }, [status, session, trustCardDraft, isSyncing, savePreviewToPermanent, update, router])

  return { isSyncing }
}
