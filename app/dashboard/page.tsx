"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { Shield, LayoutDashboard, BadgeCheck, ShieldCheck, Settings, LogOut, LifeBuoy } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import dynamic from "next/dynamic"

// Dynamically load the Goal Dashboard
const GoalDashboard = dynamic(() => import("@/components/dashboard/goal-dashboard"), {
  loading: () => <div className="flex items-center justify-center h-full min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
})

import { getGoalConfig } from "@/data/goals"



export default function DashboardPage() {
  const router = useRouter()
  const { trustCardDraft, selectedGoal, reset } = useOnboardingStore()
  const [mounted, setMounted] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("Overview")

  React.useEffect(() => {
    if (useOnboardingStore.getState().userMode === "preview") {
      router.replace(ROUTES.PROFILE + "?preview=true")
      return
    }
    setMounted(true)
  }, [router])

  if (!mounted) return null

  const firstName = trustCardDraft.fullName ? trustCardDraft.fullName.split(" ")[0] : "Agent"
  const currentConfig = getGoalConfig(selectedGoal)
  
  const handleLogout = () => {
    reset()
    localStorage.clear()
    sessionStorage.clear()
    router.replace(ROUTES.LOGIN)
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 w-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex h-full shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">R8ESTATE</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab("Overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-left ${activeTab === "Overview" ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </button>
          
          <button 
            onClick={() => setActiveTab("Trust Card")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-left ${activeTab === "Trust Card" ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <BadgeCheck className="h-5 w-5" />
            Trust Card
          </button>
          
          <button 
            onClick={() => setActiveTab("Verification")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-left ${activeTab === "Verification" ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <ShieldCheck className="h-5 w-5" />
            Verification
          </button>
          
          <button 
            onClick={() => setActiveTab("Settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-left ${activeTab === "Settings" ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
        
        {/* Dynamic Sidebar Bottom */}
        {activeTab !== "Settings" ? (
          <div className="px-4 pb-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trust Score</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">+3 this week</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2.5">
                <span className="text-2xl font-bold text-slate-900 leading-none">82</span>
                <span className="text-sm font-medium text-slate-500">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2.5">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
              </div>
              <div className="text-xs font-medium text-slate-600">
                Level: <span className="text-primary font-semibold">Strong</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-left font-medium">
              <LifeBuoy className="h-5 w-5 opacity-70" />
              <span>Contact Support</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left font-medium"
            >
              <LogOut className="h-5 w-5 opacity-80" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">R8ESTATE</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-y-auto p-6 md:p-10 pt-8">
          {activeTab === "Overview" ? (
            <GoalDashboard firstName={firstName} config={currentConfig} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-3xl font-bold text-slate-400">{activeTab}</h1>
            </div>
          )}
        </main>
      </div>
    </div>
  )


}
