import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Goal = 'More Leads' | 'More Referrals' | 'More Deals' | 'More Authority' | null

export interface Experience {
  jobTitle: string
  company: string
  startDate: string
  endDate: string // or "Present"
  description: string
}

export interface Achievement {
  title: string
  description: string
}

export interface TrustCardDraft {
  specialization: string
  biggestStrength: string
  profilePhoto: string
  fullName: string
  jobTitle: string
  company: string
  yearsOfExperience: string
  shortBio: string
  linkedIn: string
  website: string
  phoneNumber: string
  experience: Experience | null
  achievement: Achievement | null
  trustScore?: number
  profileCompletion?: number
  verificationStatus?: string
  id?: string
  userId?: string
  slug?: string
}

const defaultTrustCardDraft: TrustCardDraft = {
  specialization: '',
  biggestStrength: '',
  profilePhoto: '', // Will use default avatar if empty
  fullName: '',
  jobTitle: '',
  company: '',
  yearsOfExperience: '',
  shortBio: '',
  linkedIn: '',
  website: '',
  phoneNumber: '',
  experience: null,
  achievement: null,
  trustScore: 0,
  profileCompletion: 0,
  verificationStatus: 'Pending',
  id: undefined,
  userId: undefined,
  slug: undefined,
}

export interface OnboardingState {
  selectedGoal: Goal
  trustCardDraft: TrustCardDraft
  savedTrustCard: TrustCardDraft | null
  currentStep: number // 1 to 5
  isOnboardingCompleted: boolean
  isEditMode: boolean
  isInlineEditing: boolean
  tempDraft: TrustCardDraft | null
  userMode: "preview" | "registered"
  previewExpiresAt: string | null

  setUserMode: (mode: "preview" | "registered") => void
  setGoal: (goal: Goal) => void
  setEditMode: (isEdit: boolean) => void
  setInlineEditing: (isEditing: boolean) => void
  setTempDraft: (draft: TrustCardDraft | null) => void
  updateTempDraft: (data: Partial<TrustCardDraft>) => void
  updateDraft: (data: Partial<TrustCardDraft>) => void
  nextStep: () => void
  previousStep: () => void
  completeOnboarding: () => void
  reset: () => void
  savePreviewToPermanent: () => void
  resetPreviewDraft: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      selectedGoal: null,
      trustCardDraft: defaultTrustCardDraft,
      savedTrustCard: null,
      currentStep: 1,
      isOnboardingCompleted: false,
      isEditMode: false,
      isInlineEditing: false,
      tempDraft: null,
      userMode: "preview",
      previewExpiresAt: null,

      setUserMode: (mode) => set({ userMode: mode }),
      setGoal: (goal) => set({ selectedGoal: goal }),
      setEditMode: (isEdit) => set({ isEditMode: isEdit }),
      setInlineEditing: (isEditing) => set({ isInlineEditing: isEditing }),
      setTempDraft: (draft) => set({ tempDraft: draft }),
      
      updateTempDraft: (data) =>
        set((state) => ({
          tempDraft: state.tempDraft ? { ...state.tempDraft, ...data } : null
        })),
      
      updateDraft: (data) => 
        set((state) => {
          if (state.userMode === "registered" && state.savedTrustCard) {
            return { savedTrustCard: { ...state.savedTrustCard, ...data } }
          }
          return { trustCardDraft: { ...state.trustCardDraft, ...data } }
        }),
        
      nextStep: () => 
        set((state) => ({ 
          currentStep: Math.min(state.currentStep + 1, 7) 
        })),
        
      previousStep: () => 
        set((state) => ({ 
          currentStep: Math.max(state.currentStep - 1, 1) 
        })),

      completeOnboarding: () => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        
        set({ 
          isOnboardingCompleted: true,
          currentStep: 1,     // Reset step
          previewExpiresAt: expirationDate.toISOString()
          // preserve trustCardDraft, userMode, and selectedGoal
        });
      },

      savePreviewToPermanent: () => 
        set((state) => ({
          savedTrustCard: state.trustCardDraft,
          trustCardDraft: defaultTrustCardDraft,
          userMode: "registered",
          isOnboardingCompleted: true, // Should already be true, but ensure it
          previewExpiresAt: null
        })),

      resetPreviewDraft: () => 
        set({
          trustCardDraft: defaultTrustCardDraft,
          isOnboardingCompleted: false,
          currentStep: 1,
          selectedGoal: null,
          previewExpiresAt: null
        }),

      reset: () => 
        set({
          selectedGoal: null,
          trustCardDraft: defaultTrustCardDraft,
          savedTrustCard: null,
          currentStep: 1,
          isOnboardingCompleted: false,
          isEditMode: false,
          isInlineEditing: false,
          tempDraft: null,
          userMode: "preview",
          previewExpiresAt: null,
        })
    }),
    {
      name: 'onboarding-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
