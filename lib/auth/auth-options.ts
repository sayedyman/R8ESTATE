import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createAdminClient } from "@/lib/supabase/admin"
import { randomUUID } from "crypto"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email
        if (!email) {
          console.error("Sign in failed: No email provided by Google OAuth.")
          return false
        }

        const supabaseAdmin = createAdminClient()

        try {
          // 1. Check if user exists in public.users by email
          const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, is_onboarding_completed")
            .eq("email", email)
            .maybeSingle()

          if (fetchError) {
            console.error("Error fetching user from public.users:", fetchError.message)
            return false
          }

          if (!existingUser) {
            // 2. User doesn't exist. Create record directly in public.users with a new UUID.
            const userId = randomUUID()

            const { error: insertError } = await supabaseAdmin
              .from("users")
              .insert({
                id: userId,
                full_name: user.name || "",
                email: email,
                avatar_url: user.image || "",
                auth_provider: "google",
                google_user_id: profile?.sub || user.id,
                is_onboarding_completed: false,
              })

            if (insertError) {
              console.error("Error inserting user into public.users:", insertError.message)
              return false
            }

            // Bind values to the NextAuth user object for the jwt callback
            (user as any).id = userId;
            (user as any).isOnboardingCompleted = false;
            console.log(`Successfully created user record for ${email} with ID ${userId}.`)
          } else {
            // 3. User exists. Update their profile information if it has changed
            const { error: updateError } = await supabaseAdmin
              .from("users")
              .update({
                full_name: user.name || undefined,
                avatar_url: user.image || undefined,
                google_user_id: profile?.sub || user.id,
              })
              .eq("email", email)

            if (updateError) {
              console.warn("Non-fatal: Error updating user profile details on login:", updateError.message)
            }

            // Bind existing database fields to user object for the jwt callback
            (user as any).id = existingUser.id;
            (user as any).isOnboardingCompleted = existingUser.is_onboarding_completed;
            console.log(`Signed in existing user ${email} with ID ${existingUser.id}.`)
          }
        } catch (err) {
          console.error("Unexpected error in NextAuth signIn callback:", err)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, trigger, session }) {
      // The user object is only passed on the initial sign in
      if (user) {
        token.id = (user as any).id
        token.isOnboardingCompleted = (user as any).isOnboardingCompleted
      }
      
      // Update session if trigger is called from client
      if (trigger === "update" && session?.isOnboardingCompleted !== undefined) {
        token.isOnboardingCompleted = session.isOnboardingCompleted
      }
      
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isOnboardingCompleted = token.isOnboardingCompleted;
      }
      return session
    }
  }
}
