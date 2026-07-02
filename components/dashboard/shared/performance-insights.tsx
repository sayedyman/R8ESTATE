"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { InsightCard } from "@/types/dashboard"

interface PerformanceInsightsProps {
  insights: InsightCard[]
}

export function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  if (!insights || insights.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {insights.map((insight) => {
        const isPositive = insight.isPositive
        const borderColor =
          isPositive === false
            ? "border-l-red-400"
            : isPositive === true
            ? "border-l-emerald-400"
            : "border-l-slate-300"

        const TrendIcon = isPositive === false ? TrendingDown : TrendingUp
        const trendColor =
          isPositive === false
            ? "text-red-500 bg-red-50"
            : "text-emerald-600 bg-emerald-50"

        return (
          <Card
            key={insight.id}
            className={`overflow-hidden border-l-4 ${borderColor}`}
          >
            <CardContent className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {insight.title}
                </p>
                {isPositive !== undefined && (
                  <span
                    className={`flex items-center justify-center h-5 w-5 rounded-md ${trendColor}`}
                  >
                    <TrendIcon className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {insight.content}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
