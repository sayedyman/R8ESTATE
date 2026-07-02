import type { ExtractedCVData } from '@/types/cv-import.types'
import type { TrustCardDraft } from '@/stores/onboarding-store'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

/**
 * CVImportUtils — client-safe pure utility functions for CV import.
 *
 * Contains NO server-only imports (no next/headers, no server Supabase client).
 * Safe to import from Client Components.
 *
 * Server-side operations (upload to storage, AI extraction) live exclusively
 * in the API route handlers: /api/cv/upload and /api/cv/extract.
 */
export class CVImportUtils {
  /**
   * Validates that the file is a PDF and within the 10 MB limit.
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Only PDF files are supported.' }
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: 'File size must be under 10 MB.' }
    }
    return { valid: true }
  }

  /**
   * Maps extracted CV data to the Trust Card draft fields.
   * Pure function — no side effects, no network calls.
   */
  static mapExtractedDataToDraft(data: ExtractedCVData): Partial<TrustCardDraft> {
    return {
      fullName: data.fullName || '',
      jobTitle: data.jobTitle || '',
      company: data.company || '',
      shortBio: data.shortBio || data.skills || '',
      yearsOfExperience: data.yearsOfExperience || '',
      linkedIn: data.linkedIn || '',
      website: data.website || '',
      phoneNumber: data.phone || '',
      specialization: data.specialization || '',
      biggestStrength: data.skills || '',
      experience: data.experience ? {
        jobTitle: data.experience.jobTitle || '',
        company: data.experience.company || '',
        startDate: data.experience.startDate || '',
        endDate: data.experience.endDate || '',
        description: data.experience.description || ''
      } : null,
      achievement: data.achievement ? {
        title: data.achievement.title || '',
        description: data.achievement.description || ''
      } : null,
    }
  }
}
