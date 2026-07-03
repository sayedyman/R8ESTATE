"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Edit, Share2, Link as LinkIcon, Info, X, CheckCircle2 } from "lucide-react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { ShareModal } from "./share-modal"
import { motion, AnimatePresence } from "framer-motion"
import { generateSlug } from "@/lib/services/trust-card.service"
import { useSession } from "next-auth/react"
import { TrustCardService } from "@/lib/services/trust-card.service"
import { updateTrustCardAction } from "@/lib/actions/trust-card.actions"
import { updateUserAction } from "@/lib/actions/user.actions"
import { useTranslations } from "next-intl"

export function OwnerPreviewBanner() {
  const router = useRouter()
  const { data: session } = useSession()
  const t = useTranslations("profile")
  const { isInlineEditing, tempDraft, setInlineEditing, setTempDraft, updateDraft, trustCardDraft, savedTrustCard, userMode } = useOnboardingStore()
  const [toastMessage, setToastMessage] = React.useState("")
  const [isShareOpen, setIsShareOpen] = React.useState(false)

  const handleEdit = () => {
    const draftToEdit = userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft;
    setTempDraft({ ...draftToEdit })
    setInlineEditing(true)
  }

  const handleSave = async () => {
    if (tempDraft) {
      updateDraft(tempDraft)
      
      if (session?.user?.id) {
        try {
          const trustCardService = new TrustCardService()
          const existingCard = await trustCardService.getTrustCardByUserId(session.user.id)
          if (existingCard) {
            // Update existing Trust Card record
            await updateTrustCardAction(existingCard.id, {
              ...tempDraft,
              selected_goal: useOnboardingStore.getState().selectedGoal
            } as any)

            // Also update base user fields
            await updateUserAction(session.user.id, {
              full_name: tempDraft.fullName,
              avatar_url: tempDraft.profilePhoto
            })
          }
        } catch (err) {
          console.error("Error saving edits to Supabase:", err)
        }
      }
      
      showToast(t("ownerBanner.updateSuccess"))
    }
    setInlineEditing(false)
    setTempDraft(null)
  }

  const handleCancel = () => {
    setInlineEditing(false)
    setTempDraft(null)
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const getUrl = () => {
    const draft = userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft;
    // Use the stored permanent slug; fall back to generating from fullName for guest previews only
    const slug = draft?.slug || (draft?.fullName ? generateSlug(draft.fullName) : "preview");
    return `${window.location.origin}/u/${slug}`;
  }

  const handleShare = async () => {
    const url = getUrl()
    const name = (userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft)?.fullName || "Agent"
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Trust Card`,
          text: "Check out my verified professional Trust Card profile!",
          url,
        })
        return
      } catch (err) {
        console.warn("Native share failed, opening modal:", err)
      }
    }
    setIsShareOpen(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getUrl())
    showToast(t("ownerBanner.copySuccess"))
  }

  const shareLinks = {
    whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent('Check out my Trust Card: ' + getUrl())}`),
    linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`),
    twitter: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent('Check out my Trust Card!')}`),
    email: () => window.open(`mailto:?subject=My Trust Card&body=${encodeURIComponent('Check out my Trust Card here: ' + getUrl())}`)
  }

  return (
    <>
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-40 rtl:flip">
        <div className="flex items-start sm:items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-[15px]">{t("ownerBanner.title")}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {userMode === "preview" ? t("ownerBanner.guestSubtitle") : t("ownerBanner.subtitle")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 sm:ml-auto">
          {!isInlineEditing ? (
            <>
              <Button 
                size="sm"
                variant="ghost" 
                className="h-9 text-slate-300 hover:text-white hover:bg-white/10 hidden sm:flex gap-2 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleCopyLink}
                disabled={userMode === "preview"}
              >
                <LinkIcon className="h-4 w-4" />
                {t("ownerBanner.copyLink")}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 bg-white/10 hover:bg-white/20 text-white border-0"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                {t("ownerBanner.editTrustCard")}
              </Button>
              
              <Button 
                size="sm" 
                className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white border-0 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleShare}
                disabled={userMode === "preview"}
              >
                <Share2 className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                {t("ownerBanner.shareLink")}
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm"
                variant="ghost" 
                className="h-9 text-slate-300 hover:text-white hover:bg-white/10"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1.5" />
                {t("ownerBanner.cancel")}
              </Button>
              <Button 
                size="sm"
                className="h-9 bg-white text-slate-900 hover:bg-slate-100"
                onClick={handleSave}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {t("ownerBanner.saveChanges")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-slate-700">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="font-medium text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        url={getUrl()} 
      />
    </>
  )
}
