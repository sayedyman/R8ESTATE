"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, Eye, MousePointerClick, MessageSquare, Percent } from "lucide-react"
import { SummaryMetrics, ContactRateRating } from "@/types/dashboard"

interface GoalSummaryProps {
  firstName: string
  goalTitle: string
  metrics: SummaryMetrics
  message: string
  contactRateTarget: number
  contactRateRatings: ContactRateRating[]
}

function getContactRateRating(rate: number, ratings: ContactRateRating[]): ContactRateRating {
  // Ratings must be sorted descending by minRate in the config (highest threshold first)
  return ratings.find((r) => rate >= r.minRate) ?? ratings[ratings.length - 1]
}

export function GoalSummary({ firstName, goalTitle, metrics, message, contactRateTarget, contactRateRatings }: GoalSummaryProps) {
  const contactRate = metrics.views > 0
    ? Math.round((metrics.clicks / metrics.views) * 100)
    : 0

  const rating = getContactRateRating(contactRate, contactRateRatings)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        Last updated today at 09:41 AM
      </div>
      
      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, {firstName} 👋
            </h1>
          </div>
          
          <div className="inline-flex items-center gap-1.5 mb-6 text-primary font-semibold">
            🎯 Current Goal: {goalTitle}
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Executive Summary</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Profile Views",   value: metrics.views,        icon: Eye,              color: "text-blue-500" },
                { label: "Contact Clicks",  value: metrics.clicks,       icon: MousePointerClick, color: "text-indigo-500" },
                { label: "Conversations",   value: metrics.conversations, icon: MessageSquare,    color: "text-violet-500" },
              ].map((metric, idx) => (
                <Card key={idx} className="shadow-sm border-slate-200 h-full">
                  <CardContent className="flex flex-col h-full justify-between gap-3 pt-0">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`h-4 w-4 shrink-0 ${metric.color}`} />
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">{metric.label}</span>
                    </div>
                    <strong className="text-2xl font-bold text-slate-900 leading-none">{metric.value}</strong>
                  </CardContent>
                </Card>
              ))}

              {/* Contact Rate tile with contextual rating */}
              <Card className="shadow-sm border-slate-200 h-full">
                <CardContent className="flex flex-col h-full justify-between gap-2 pt-0">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">Contact Rate</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`self-start text-xs font-bold px-2 py-0.5 rounded-md border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                    <strong className="text-2xl font-bold text-slate-900 leading-none">{contactRate}%</strong>
                    <span className="text-xs text-slate-400 font-medium">Target: {contactRateTarget}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
              <TrendingUp className="h-5 w-5 shrink-0" />
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

