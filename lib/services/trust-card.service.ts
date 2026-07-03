import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { TrustCardDraft } from '@/stores/onboarding-store'

export type TrustCardRow = Database['public']['Tables']['trust_cards']['Row']
export type TrustCardInsert = Database['public']['Tables']['trust_cards']['Insert']
export type TrustCardUpdate = Database['public']['Tables']['trust_cards']['Update']

/**
 * Calculates a profile completion percentage based on filled fields.
 */
export function calculateCompletion(draft: Partial<TrustCardDraft>): number {
  const fields = [
    draft.fullName,
    draft.jobTitle,
    draft.company,
    draft.profilePhoto,
    draft.specialization,
    draft.biggestStrength,
    draft.shortBio,
    draft.yearsOfExperience,
    draft.linkedIn,
    draft.website,
    draft.phoneNumber,
    draft.experience,
    draft.achievement
  ]
  const filled = fields.filter(f => {
    if (f === undefined || f === null) return false
    if (typeof f === 'string') return f.trim() !== ''
    if (typeof f === 'object') {
      return Object.values(f).some(val => val && String(val).trim() !== '')
    }
    return true
  }).length
  return Math.round((filled / fields.length) * 100)
}

/**
 * Calculates a trust score dynamically.
 */
export function calculateTrustScore(draft: Partial<TrustCardDraft>): number {
  let score = 40 // Base score
  if (draft.fullName) score += 5
  if (draft.profilePhoto) score += 5
  if (draft.jobTitle && draft.company) score += 10
  if (draft.specialization && draft.biggestStrength) score += 10
  if (draft.experience && Object.values(draft.experience).some(val => val)) score += 5
  if (draft.achievement && Object.values(draft.achievement).some(val => val)) score += 5
  return Math.min(score, 100)
}

/**
 * Maps a database Trust Card row into the frontend Zustand TrustCardDraft state format.
 */
export function mapRowToDraft(row: TrustCardRow): TrustCardDraft {
  return {
    specialization: row.specialization || '',
    biggestStrength: row.strengths || '',
    profilePhoto: row.profile_photo || '',
    fullName: row.full_name || '',
    jobTitle: row.job_title || '',
    company: row.company || '',
    yearsOfExperience: row.years_of_experience || '',
    shortBio: row.short_bio || '',
    linkedIn: row.linkedin || '',
    website: row.website || '',
    phoneNumber: row.phone || '',
    experience: row.experience ? (row.experience as any) : null,
    achievement: row.achievement ? (row.achievement as any) : null,
    trustScore: row.trust_score,
    profileCompletion: Number(row.profile_completion),
    verificationStatus: row.verification_status,
    id: row.id,
    userId: row.user_id,
  }
}

/**
 * Maps frontend state format into a database Trust Card insertion payload.
 */
export function mapDraftToInsert(
  userId: string, 
  draft: Partial<TrustCardDraft>, 
  selectedGoal?: string | null
): TrustCardInsert {
  const completion = calculateCompletion(draft)
  const score = calculateTrustScore(draft)

  const insert: TrustCardInsert = {
    user_id: userId,
    profile_completion: completion,
    trust_score: score,
    verification_status: draft.verificationStatus || 'Pending',
  }

  if (selectedGoal !== undefined) insert.selected_goal = selectedGoal
  if (draft.specialization !== undefined) insert.specialization = draft.specialization
  if (draft.biggestStrength !== undefined) insert.strengths = draft.biggestStrength
  if (draft.profilePhoto !== undefined) insert.profile_photo = draft.profilePhoto
  if (draft.fullName !== undefined) insert.full_name = draft.fullName
  if (draft.jobTitle !== undefined) insert.job_title = draft.jobTitle
  if (draft.company !== undefined) insert.company = draft.company
  if (draft.yearsOfExperience !== undefined) insert.years_of_experience = draft.yearsOfExperience
  if (draft.shortBio !== undefined) insert.short_bio = draft.shortBio
  if (draft.linkedIn !== undefined) insert.linkedin = draft.linkedIn
  if (draft.website !== undefined) insert.website = draft.website
  if (draft.phoneNumber !== undefined) insert.phone = draft.phoneNumber
  if (draft.experience !== undefined) insert.experience = draft.experience as any
  if (draft.achievement !== undefined) insert.achievement = draft.achievement as any

  return insert
}

/**
 * Maps frontend state updates into a database Trust Card update payload.
 */
export function mapDraftToUpdate(
  draft: Partial<TrustCardDraft> & { selected_goal?: string | null }
): TrustCardUpdate {
  const update: TrustCardUpdate = {}

  const completion = calculateCompletion(draft)
  const score = calculateTrustScore(draft)
  update.profile_completion = completion
  update.trust_score = score

  if (draft.selected_goal !== undefined) update.selected_goal = draft.selected_goal
  if (draft.verificationStatus !== undefined) update.verification_status = draft.verificationStatus
  if (draft.specialization !== undefined) update.specialization = draft.specialization
  if (draft.biggestStrength !== undefined) update.strengths = draft.biggestStrength
  if (draft.profilePhoto !== undefined) update.profile_photo = draft.profilePhoto
  if (draft.fullName !== undefined) update.full_name = draft.fullName
  if (draft.jobTitle !== undefined) update.job_title = draft.jobTitle
  if (draft.company !== undefined) update.company = draft.company
  if (draft.yearsOfExperience !== undefined) update.years_of_experience = draft.yearsOfExperience
  if (draft.shortBio !== undefined) update.short_bio = draft.shortBio
  if (draft.linkedIn !== undefined) update.linkedin = draft.linkedIn
  if (draft.website !== undefined) update.website = draft.website
  if (draft.phoneNumber !== undefined) update.phone = draft.phoneNumber
  if (draft.experience !== undefined) update.experience = draft.experience as any
  if (draft.achievement !== undefined) update.achievement = draft.achievement as any

  return update
}

export class TrustCardService {
  private supabase: SupabaseClient<Database>

  constructor(supabaseClient?: SupabaseClient<Database>) {
    this.supabase = supabaseClient || createBrowserClient()
  }

  /**
   * Fetches the trust card belonging to a user.
   */
  async getTrustCardByUserId(userId: string): Promise<TrustCardRow | null> {
    const { data, error } = await this.supabase
      .from('trust_cards')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error(`Error fetching trust card for user ${userId}:`, error.message)
      throw error
    }

    return data
  }

  /**
   * Fetches a specific trust card by its ID.
   */
  async getTrustCardById(id: string): Promise<TrustCardRow | null> {
    const { data, error } = await this.supabase
      .from('trust_cards')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error(`Error fetching trust card by ID ${id}:`, error.message)
      throw error
    }

    return data
  }

  /**
   * Fetches a trust card by its generated name slug.
   */
  async getTrustCardBySlug(slug: string): Promise<TrustCardRow | null> {
    const parts = slug.split('-')
    let query = this.supabase.from('trust_cards').select('*')
    if (parts.length > 0) {
      query = query.ilike('full_name', `%${parts[0]}%`)
    }
    const { data, error } = await query

    if (error) {
      console.error(`Error fetching trust card by slug ${slug}:`, error.message)
      throw error
    }

    const generateSlug = (name: string): string => {
      if (!name) return ""
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    }

    const match = data?.find(row => generateSlug(row.full_name || '') === slug)
    return match || null
  }

  /**
   * Creates (or upserts) a trust card for a user from frontend draft data.
   * Uses upsert on user_id to safely handle cases where the sync hook fires more than once.
   */
  async createTrustCard(userId: string, draft: TrustCardDraft, selectedGoal?: string | null): Promise<TrustCardRow> {
    const payload = mapDraftToInsert(userId, draft, selectedGoal)
    const { data, error } = await this.supabase
      .from('trust_cards')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error(`Error upserting trust card for user ${userId}:`, error.message)
      throw error
    }

    return data
  }

  /**
   * Updates an existing trust card with new draft data.
   */
  async updateTrustCard(id: string, draft: Partial<TrustCardDraft> & { selected_goal?: string | null }): Promise<TrustCardRow> {
    const payload = mapDraftToUpdate(draft)
    const { data, error } = await this.supabase
      .from('trust_cards')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating trust card ${id}:`, error.message)
      throw error
    }

    return data
  }

  /**
   * Deletes a trust card.
   */
  async deleteTrustCard(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('trust_cards')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting trust card ${id}:`, error.message)
      throw error
    }
  }
}
