"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createAdminClient } from "@/lib/supabase/admin";
import { AnalyticsService, EventPayload } from "@/lib/services/analytics.service";
import { analyticsEventSchema } from "@/schemas/analytics.schema";

export async function trackEventAction(payload: EventPayload) {
  // We do not enforce strict auth here because anonymous visitors can trigger analytics events
  // However, if there is a session, we can optionally use it to resolve visitorId
  // The service itself runs securely on the backend.
  
  // Zod Validation
  const validatedPayload = analyticsEventSchema.parse(payload) as EventPayload;

  // Execute Service using Admin Client
  const adminClient = createAdminClient();
  const analyticsService = new AnalyticsService(adminClient);
  
  return analyticsService.trackEvent(validatedPayload);
}
