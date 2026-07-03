"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveOnboardingResult } from "@/lib/services/onboarding.service";
import { TrustCardDraft } from "@/stores/onboarding-store";
import { trustCardDraftSchema } from "@/schemas/trust-card.schema";

export async function saveOnboardingResultAction(draft: TrustCardDraft, selectedGoal?: string | null): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Zod Validation
  const validatedDraft = trustCardDraftSchema.parse(draft) as TrustCardDraft;

  // Execute Service using Admin Client
  const adminClient = createAdminClient();
  await saveOnboardingResult(session.user.id, validatedDraft, selectedGoal, adminClient);
}
