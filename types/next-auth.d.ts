import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isOnboardingCompleted: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    isOnboardingCompleted: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isOnboardingCompleted: boolean
  }
}
