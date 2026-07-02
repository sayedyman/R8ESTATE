// Mock session handling.
// Could be replaced with next-auth / Supabase session getters.

import { Session } from "@/types/auth";

export async function getSession(): Promise<Session> {
  // Return a mock unauthenticated session for now
  return {
    user: null,
    isAuthenticated: false,
    token: null,
  };
}
