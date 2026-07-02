import * as React from "react"
import { Check, Circle } from "lucide-react"
import { calculatePasswordStrength, type PasswordStrengthResult } from "@/lib/password-strength"

interface PasswordStrengthIndicatorProps {
  password?: string
}

export function PasswordStrengthIndicator({ password = "" }: PasswordStrengthIndicatorProps) {
  const result: PasswordStrengthResult = calculatePasswordStrength(password)

  return (
    <div className="w-full">
      <div className="mt-3 space-y-2">
        {result.requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-[13px]">
            {req.isMet ? (
              <Check className="h-3.5 w-3.5 text-success transition-all duration-200" />
            ) : (
              <Circle className="h-3 w-3 text-slate-300 transition-all duration-200" />
            )}
            <span className={`transition-colors duration-200 ${req.isMet ? 'text-success' : 'text-slate-500'}`} aria-live="polite">
              {req.label}
              <span className="sr-only">{req.isMet ? "Requirement met" : "Requirement not met"}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-slate-100 overflow-hidden" style={{ display: password.length > 0 ? 'block' : 'none' }}>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-500">Password Strength</span>
          <span className={`text-xs font-semibold transition-colors duration-300 ${result.strengthText}`} aria-live="polite">{result.strength}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ease-out ${result.strengthColor} ${result.strengthWidth}`} />
        </div>
      </div>
    </div>
  )
}
