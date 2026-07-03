"use client"

import * as React from "react"
import Link from "next/link"
import { Shield } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 w-full relative">
      {/* Top Navigation */}
      <header className="w-full p-6 flex justify-between items-center z-10 shrink-0">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl text-slate-900 tracking-tight">R8ESTATE</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pb-4 sm:pb-6 w-full">
        {children}
      </main>
    </div>
  )
}
