"use client"

import * as React from "react"
import { Achievement } from "@/stores/onboarding-store"
import { Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface TrustCardAchievementProps {
  achievement?: Achievement | null
  isInlineEditing?: boolean
  onUpdate?: (updates: { achievement: Achievement }) => void
}

export function TrustCardAchievement({ achievement, isInlineEditing, onUpdate }: TrustCardAchievementProps) {
  if (!achievement && !isInlineEditing) return null

  const currentAch = achievement || {
    title: "",
    description: ""
  }

  const handleChange = (field: keyof Achievement, value: string) => {
    onUpdate?.({
      achievement: { ...currentAch, [field]: value }
    })
  }

  return (
    <div className="pt-4 border-t border-slate-100">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Achievement</h3>
      
      {isInlineEditing ? (
        <div className="space-y-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
          <Input 
            value={currentAch.title} 
            onChange={(e) => handleChange("title", e.target.value)}
            className="h-8 text-sm border-amber-200 focus-visible:ring-amber-500"
            placeholder="Achievement Title"
          />
          <Textarea 
            value={currentAch.description} 
            onChange={(e) => handleChange("description", e.target.value)}
            className="text-sm min-h-[60px] resize-none border-amber-200 focus-visible:ring-amber-500"
            placeholder="Description..."
          />
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="mt-0.5 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{currentAch.title || "Achievement Title"}</h4>
            {currentAch.description && (
              <p className="text-slate-600 text-xs leading-relaxed">
                {currentAch.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
