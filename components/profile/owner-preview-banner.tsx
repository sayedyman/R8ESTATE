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

export function OwnerPreviewBanner() {
  const router = useRouter()
  const { isInlineEditing, tempDraft, setInlineEditing, setTempDraft, updateDraft, trustCardDraft, savedTrustCard, userMode } = useOnboardingStore()
  const [toastMessage, setToastMessage] = React.useState("")
  const [isShareOpen, setIsShareOpen] = React.useState(false)

  const handleEdit = () => {
    const draftToEdit = userMode === "registered" && savedTrustCard ? savedTrustCard : trustCardDraft;
    setTempDraft({ ...draftToEdit })
    setInlineEditing(true)
  }

  const handleSave = () => {
    if (tempDraft) {
      updateDraft(tempDraft)
      showToast("Your Trust Card has been updated successfully.")
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
    showToast("Link copied successfully.")
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
      <div className="w-full bg-slate-900 text-white shadow-md z-40 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/20 p-2.5 rounded-xl mt-0.5 shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isInlineEditing ? "Edit Mode" : "This is how clients will see your Trust Card"}
              </h3>
              <p className="text-slate-300 text-[15px] mt-0.5">
                {isInlineEditing 
                  ? "Make changes below and click Save Changes when you're done."
                  : "Your Trust Card has been published successfully. You can share it now or update it anytime."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto shrink-0 justify-end">
            {!isInlineEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  className="h-10 px-5 text-slate-300 hover:text-white hover:bg-white/10 hidden sm:flex gap-2 font-medium"
                  onClick={handleCopyLink}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Copy Link</span>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="h-10 px-5 bg-white/10 text-white hover:bg-white/20 border-0 flex-1 sm:flex-none gap-2 font-medium"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share Link
                </Button>
                
                <Button 
                  className="h-10 px-5 bg-white text-slate-900 hover:bg-slate-100 flex-1 sm:flex-none gap-2 font-semibold shadow-sm"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  Edit Trust Card
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="h-10 px-5 text-slate-300 hover:text-white hover:bg-white/10 flex-1 sm:flex-none gap-2 font-medium"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  className="h-10 px-5 bg-white text-slate-900 hover:bg-slate-100 flex-1 sm:flex-none gap-2 font-semibold shadow-sm"
                  onClick={handleSave}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-slate-700">
            <CheckCircle2 className="h-5 w-5 text-success" />
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
              {/* Floating Icon */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-slate-700" />
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setIsShareOpen(false)} 
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <h3 className="font-extrabold text-[22px] text-slate-900 mb-3 tracking-tight">Share Your Trust Card</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-[300px] mx-auto">
                Share your professional Trust Card with clients, colleagues, or anyone you'd like to build trust with.
              </p>

              {/* Link Input Section */}
              <div className="relative flex items-center w-full mb-8 group">
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
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">or share directly</span>
                <div className="h-px bg-slate-100 flex-1"></div>
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
