"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit3, ExternalLink, Copy, Share2, Download } from "lucide-react"

export function QuickActions() {
  const actions = [
    { icon: Edit3, label: "Edit Trust Card" },
    { icon: ExternalLink, label: "View Public Profile" },
    { icon: Copy, label: "Copy Public Link" },
    { icon: Share2, label: "Share Profile" },
    { icon: Download, label: "Download QR Code" }
  ]

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <button 
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-center gap-3 group"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Icon className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
