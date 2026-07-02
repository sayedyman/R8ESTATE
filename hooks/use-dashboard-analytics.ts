import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AnalyticsService } from "@/lib/services/analytics.service"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { getGoalConfig } from "@/data/goals"
import { GoalConfig } from "@/types/dashboard"

/**
 * Client hook that fetches custom aggregated analytics stats from Supabase
 * and merges them dynamically into the active GoalConfig schema.
 */
export function useDashboardAnalytics() {
  const { data: session, status } = useSession()
  const { selectedGoal, savedTrustCard } = useOnboardingStore()
  
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsConfig, setAnalyticsConfig] = useState<GoalConfig | null>(null)
  const [hasNoAnalytics, setHasNoAnalytics] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      if (status !== "authenticated" || !session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const analyticsService = new AnalyticsService()
        const data = await analyticsService.getDashboardAnalytics(session.user.id)
        
        const baseConfig = getGoalConfig(selectedGoal)
        
        const mergedConfig: GoalConfig = {
          ...baseConfig,
          summaryMetrics: {
            views: data.views,
            clicks: data.clicks,
            conversations: data.conversations
          },
          summaryMessage: data.views > 0 
            ? `Your Contact Rate is currently ${data.contactRate}% based on recent profile visits.`
            : "Your profile hasn't received any views yet.",
          funnel: [
            { label: "Profile Views", value: data.views, percentage: 100, color: "bg-blue-500" },
            { label: "Contact Clicks", value: data.clicks, percentage: data.views > 0 ? Math.round((data.clicks / data.views) * 100) : 0, color: "bg-indigo-500" },
            { label: "Conversations", value: data.conversations, percentage: data.views > 0 ? Math.round((data.conversations / data.views) * 100) : 0, color: "bg-violet-500" }
          ],
          funnelInsight: {
            between: "Profile Views and Contact Clicks",
            recommendation: data.clicks === 0 
              ? "Improve your profile details or add WhatsApp to encourage contact clicks." 
              : "Keep updating your Trust Card to maintain active engagement."
          },
          chartData: data.chartData,
          chartSummary: {
            growthPercent: data.growthPercent,
            bestDay: data.bestDay || "None"
          },
          goalProgress: {
            metricLabel: "Contact Rate",
            currentRate: data.contactRate,
            targetRate: baseConfig.contactRateTarget
          },
          insights: data.insights,
          recommendations: data.recommendations,
          recentActivity: data.recentActivity
        }

        setAnalyticsConfig(mergedConfig)
        setHasNoAnalytics(data.hasNoAnalytics)
      } catch (err) {
        console.error("Error loading dashboard analytics:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchAnalytics()
    } else if (status === "unauthenticated") {
      setIsLoading(false)
    }
  }, [status, session, selectedGoal, savedTrustCard])

  return { analyticsConfig, isLoading, hasNoAnalytics, userId: session?.user?.id }
}
