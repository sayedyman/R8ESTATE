import { UserService } from "./user.service"
import { TrustCardService } from "./trust-card.service"
import { TrustCardDraft } from "@/stores/onboarding-store"

import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/database.types"

/**
 * Saves the onboarding results to Supabase.
 * Inserts the trust card draft data and sets the user's is_onboarding_completed flag to true.
 */
export async function saveOnboardingResult(
  userId: string, 
  draft: TrustCardDraft, 
  selectedGoal?: string | null,
  client?: SupabaseClient<Database>
): Promise<void> {
  const userService = new UserService(client)
  const trustCardService = new TrustCardService(client)

  try {
    // 1. Insert the trust card record linked to this user
    await trustCardService.createTrustCard(userId, draft, selectedGoal)

    // 2. Mark onboarding completion status on the user profile
    await userService.updateUser(userId, { is_onboarding_completed: true })
  } catch (error) {
    console.error("Failed to save onboarding details and finalize status:", error)
    throw error
  }
}
