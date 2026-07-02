"use client"

import * as React from "react"
import { Experience } from "@/stores/onboarding-store"
import { Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface TrustCardExperienceProps {
  experience?: Experience | null
  isInlineEditing?: boolean
  onUpdate?: (updates: { experience: Experience }) => void
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const parseDate = (dateStr: string) => {
  if (!dateStr || dateStr === "Present") return { month: "", year: "" };
  const parts = dateStr.split(" ");
  return { month: parts[0] || "", year: parts[1] || "" };
};

export function TrustCardExperience({ experience, isInlineEditing, onUpdate }: TrustCardExperienceProps) {
  if (!experience && !isInlineEditing) return null

  const currentExp = experience || {
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: ""
  }

  const start = parseDate(currentExp.startDate);
  const end = parseDate(currentExp.endDate);
  const isPresent = currentExp.endDate === "Present";

  const handleChange = (field: keyof Experience, value: string) => {
    onUpdate?.({
      experience: { ...currentExp, [field]: value }
    })
  }

  return (
    <div className="pt-4 border-t border-slate-100">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Experience</h3>
      
      {isInlineEditing ? (
        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Input 
            value={currentExp.jobTitle} 
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            className="h-8 text-sm"
            placeholder="Job Title"
          />
          <Input 
            value={currentExp.company} 
            onChange={(e) => handleChange("company", e.target.value)}
            className="h-8 text-sm"
            placeholder="Company"
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <select 
                className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={start.month}
                onChange={(e) => handleChange("startDate", `${e.target.value} ${start.year}`.trim())}
              >
                <option value="" disabled>Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select 
                className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={start.year}
                onChange={(e) => handleChange("startDate", `${start.month} ${e.target.value}`.trim())}
              >
                <option value="" disabled>Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <select 
                className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={end.month}
                onChange={(e) => handleChange("endDate", `${e.target.value} ${end.year}`.trim())}
                disabled={isPresent}
              >
                <option value="" disabled>Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select 
                className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={end.year}
                onChange={(e) => handleChange("endDate", `${end.month} ${e.target.value}`.trim())}
                disabled={isPresent}
              >
                <option value="" disabled>Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-1 px-1">
              <input 
                type="checkbox" 
                id="inline-present" 
                checked={isPresent} 
                onChange={(e) => handleChange("endDate", e.target.checked ? "Present" : "")} 
                className="h-3 w-3 rounded border-slate-300 text-primary focus:ring-primary accent-primary"
              />
              <label htmlFor="inline-present" className="text-[11px] font-medium text-slate-500 cursor-pointer m-0">Currently work here</label>
            </div>
          </div>
          <Textarea 
            value={currentExp.description} 
            onChange={(e) => handleChange("description", e.target.value)}
            className="text-sm min-h-[60px] resize-none"
            placeholder="Description..."
          />
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight">{currentExp.jobTitle || "Job Title"}</h4>
            <p className="text-primary font-medium text-xs mb-1">{currentExp.company || "Company"}</p>
            <p className="text-slate-400 text-xs mb-2">
              {currentExp.startDate || "Start Date"} - {currentExp.endDate || "End Date"}
            </p>
            {currentExp.description && (
              <p className="text-slate-600 text-xs leading-relaxed">
                {currentExp.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
