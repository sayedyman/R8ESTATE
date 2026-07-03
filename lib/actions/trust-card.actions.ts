"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createAdminClient } from "@/lib/supabase/admin";
import { TrustCardService } from "@/lib/services/trust-card.service";
import { TrustCardDraft } from "@/stores/onboarding-store";
import { trustCardDraftSchema } from "@/schemas/trust-card.schema";

export async function updateTrustCardAction(id: string, draft: Partial<TrustCardDraft> & { selected_goal?: string | null }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Zod Validation
  const validatedDraft = trustCardDraftSchema.partial().parse(draft) as Partial<TrustCardDraft>;

  // Execute Service using Admin Client
  const adminClient = createAdminClient();
  const trustCardService = new TrustCardService(adminClient);
  
  // Security check: ensure the user owns the card before updating
  const existingCard = await trustCardService.getTrustCardById(id);
  if (!existingCard || existingCard.user_id !== session.user.id) {
      throw new Error("Forbidden: You do not own this trust card.");
  }

  return trustCardService.updateTrustCard(id, { ...validatedDraft, selected_goal: draft.selected_goal });
}
