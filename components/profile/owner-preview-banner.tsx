"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Edit, Share2, Link as LinkIcon, Info, X, CheckCircle2, Copy } from "lucide-react"
import { Linkedin, Facebook, Twitter } from "@/components/ui/social-icons"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { motion, AnimatePresence } from "framer-motion"
import { generateSlug } from "@/hooks/use-public-trust-card"
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
    const slug = draft?.fullName ? generateSlug(draft.fullName) : "preview";
    return `${window.location.origin}/u/${slug}`;
  }

  const handleShare = () => {
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
            <p className="text-xs text-slate-400 mt-0.5">{t("ownerBanner.subtitle")}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 sm:ml-auto">
          {!isInlineEditing ? (
            <>
              <Button 
                size="sm"
                variant="ghost" 
                className="h-9 text-slate-300 hover:text-white hover:bg-white/10 hidden sm:flex gap-2"
                onClick={handleCopyLink}
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
                className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                onClick={handleShare}
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

      {/* Share Modal */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setIsShareOpen(false)}>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-[420px] pt-12 pb-8 px-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsShareOpen(false)} 
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <h3 className="text-xl font-bold text-slate-900 pr-8">{t("share.title")}</h3>
              <p className="text-sm text-slate-500 mt-1">{t("share.subtitle")}</p>

              {/* Link Input Section */}
              <div className="relative flex items-center w-full mt-8 mb-8 group">
                <input 
                  type="text" 
                  readOnly 
                  value={getUrl()} 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-[15px] font-medium rounded-2xl py-4 pl-5 pr-14 outline-none transition-colors group-hover:border-slate-300"
                />
                <button 
                  onClick={handleCopyLink}
                  className="absolute right-2 p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded-xl shadow-sm transition-all active:scale-95"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-8 rtl:flip">
                <div className="h-px bg-slate-100 flex-1" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {t("share.shareVia")}
                </span>
                <div className="h-px bg-slate-100 flex-1" />
              </div>

              {/* Social Buttons */}
              <div className="flex items-center justify-center gap-5 mb-8">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareLinks.facebook()}
                  className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-[#1877F2] hover:text-white hover:shadow-lg hover:shadow-blue-500/30 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareLinks.twitter()}
                  className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/20 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareLinks.whatsapp()}
                  className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/30 transition-colors"
                >
                  <span className="font-bold text-xl leading-none block pt-0.5">W</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareLinks.linkedin()}
                  className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-[#0A66C2] hover:text-white hover:shadow-lg hover:shadow-blue-600/30 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Footer text */}
              <p className="text-[13px] text-slate-400 font-medium">
                Anyone with this link can view your professional Trust Card.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
