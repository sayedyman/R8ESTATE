"use client"

import * as React from "react"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useAuthSync } from "@/hooks/use-auth-sync"

function AuthSync() {
  useAuthSync()
  return null
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <AuthSync />
      {children}
    </NextAuthSessionProvider>
  )
}
